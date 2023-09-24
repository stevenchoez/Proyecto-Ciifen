import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Estacion } from "src/app/models/inventario/estacion.entity";
import { Instrumento } from "src/app/models/inventario/instrumento.entity";
import { Pluviograma } from "src/app/models/pluviograma/pluviograma.entity";
import { EstacionService } from "src/app/services/inventario/estacion.service";
import { InstrumentoService } from "src/app/services/inventario/instrumento.service";
import { PluviogramaService } from "src/app/services/pluviograma/pluviograma.service";
import Swal from "sweetalert2";

import * as d3 from "d3";
import { Selection } from "d3-selection";

@Component({
  selector: "app-pluviogramas-edit",
  templateUrl: "./pluviogramas-edit.component.html",
  styleUrls: ["./pluviogramas-edit.component.scss"],
})
export class PluviogramasEditComponent implements OnInit {
  pluviograma: Pluviograma;
  form: FormGroup;
  estaciones: Estacion[] = [];
  instrumentos: Instrumento[] = [];
  selectedImage: File | null = null;
  basicModalCloseResult: string = "";
  selectedZone: { x1: number; y1: number; x2: number; y2: number };
  data: { x: any[]; y: any[] } = { x: [], y: [] };
  isDrawingMode = false;
  drawnPoints: { x: number; y: number }[] = [];
  imageUrl: "";
  activeTab: string = "chart";

  constructor(
    private pluviogramaService: PluviogramaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private estacionService: EstacionService,
    private instrumentoService: InstrumentoService,
    private modalService: NgbModal
  ) {
    this.form = this.fb.group(
      {
        fecha_inicio: ["", [Validators.required, Validators.maxLength(50)]],
        fecha_fin: ["", [Validators.required, Validators.maxLength(50)]],
        modelo: ["", [Validators.required, Validators.maxLength(50)]],
        ruta: ["", [Validators.required, Validators.maxLength(50)]],
        estacion: ["", [Validators.required, Validators.maxLength(50)]],
        instrumento: ["", [Validators.required, Validators.maxLength(50)]],
      },
      { validators: this.dateRangeValidator }
    );
  }

  ngOnInit(): void {
    this.cargarPluviograma();
    this.estacionService.getEstaciones().subscribe((data) => {
      this.estaciones = data.results;
    });

    this.instrumentoService.getInstrumentos().subscribe((data) => {
      this.instrumentos = data.results;
    });
  }

  cargarPluviograma(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      Swal.fire(
        "No se encontro",
        "No se encontro Pluviograma con ese Id",
        "error"
      );
      return; // exit the function early if no ID found
    }

    this.pluviogramaService.getPluviogramaById(id).subscribe({
      next: (data) => {
        this.pluviograma = data;
        this.form.patchValue({
          fecha_inicio: this.convertToDatetimeLocal(
            this.pluviograma.fecha_inicio
          ),
          fecha_fin: this.convertToDatetimeLocal(this.pluviograma.fecha_fin),
          modelo: this.pluviograma.modelo,
          ruta: this.pluviograma.ruta,
          estacion: this.pluviograma.estacion.id,
          instrumento: this.pluviograma.instrumento.id,
        });
      },
      error: (error) => {
        // Handle any error that might occur when fetching the data
        Swal.fire("Error", "Error obteniendo Pluviograma.", "error");
      },
    });
  }

  actualizarPluviograma(pluviogramaData: Pluviograma) {
    pluviogramaData.x = this.data.x;
    pluviogramaData.y = this.data.y;
    pluviogramaData.ruta = this.pluviograma.ruta;
    this.pluviogramaService
      .updatePluviograma(pluviogramaData, this.pluviograma.id)
      .subscribe({
        next: (data) => {
          Swal.fire(
            "Pluviograma actualizado",
            "Pluviograma actualizado exitosamente",
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(["/pluviogramas"]);
            }
          });
        },
      });
  }

  showFormErrors(): void {
    let errorMessage = "";
    for (const key in this.form.controls) {
      const control = this.form.controls[key];
      console.log(control.errors);

      if (control.invalid) {
        if (control.errors?.required) {
          errorMessage += `Campo ${key} es requerido.<br>`;
        } else if (control.errors?.maxlength) {
          errorMessage += `Campo ${key} no puede tener mas de ${control.errors?.maxlength.requiredLength} caracteres.<br>`;
        } else if (key === "fecha_fin" && control.errors?.dateInvalid) {
          errorMessage += `Fecha de fin no puede ser antes o igual a la fecha de inicio.<br>`;
        } else {
          errorMessage += `Campo ${key} es inválido.<br>`;
        }
      }
    }

    Swal.fire({
      icon: "error",
      title: "Error en el formulario",
      html: errorMessage,
    });
  }

  highlightInvalidControls(): void {
    for (const key in this.form.controls) {
      this.form.controls[key].markAsTouched();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.actualizarPluviograma(this.form.value);
    } else {
      this.showFormErrors();
      this.highlightInvalidControls();
    }
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const fechaInicioControl = control.get("fecha_inicio");
    const fechaFinControl = control.get("fecha_fin");

    const fechaInicio = new Date(fechaInicioControl?.value);
    const fechaFin = new Date(fechaFinControl?.value);

    if (fechaFin <= fechaInicio) {
      fechaFinControl?.setErrors({ dateInvalid: true });
      return { dateInvalid: true };
    } else {
      // This else block is added to clear the dateInvalid error once the issue is resolved
      if (fechaInicioControl?.hasError("dateInvalid")) {
        fechaInicioControl?.setErrors(null);
      }
      if (fechaFinControl?.hasError("dateInvalid")) {
        fechaFinControl?.setErrors(null);
      }
    }

    return null;
  }

  convertToDatetimeLocal(dateStr: string): string | null {
    // Convert "09/08/2023 20:12" to "2023-08-09T20:12"
    let parts = dateStr.split(" ");
    let dateParts = parts[0].split("/");
    let formattedDateStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1]}`;

    let date = new Date(formattedDateStr);

    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateStr);
      return null;
    }

    // Convert to 'YYYY-MM-DDTHH:mm' format
    return formattedDateStr;
  }

  parseDate(dateString: string): Date {
    const dateParts = dateString
      .split(" ")[0]
      .split("/")
      .map((part) => parseInt(part, 10));
    const timeParts = dateString
      .split(" ")[1]
      .split(":")
      .map((part) => parseInt(part, 10));

    // Remember: JavaScript's Date uses 0-indexed months, so subtract 1 from the month.
    return new Date(
      dateParts[2],
      dateParts[1] - 1,
      dateParts[0],
      timeParts[0],
      timeParts[1]
    );
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
      this.selectedImage = input.files[0];
    }
  }

  digitalizar(content: TemplateRef<any>): void {
    if (!this.selectedImage) {
      Swal.fire("Error", "Por favor, seleccione una imagen primero.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", this.selectedImage, this.selectedImage.name);

    // Assuming you will create a method `digitalizarImagen` in PluviogramaService.
    this.pluviogramaService.digitalizarImagen(formData).subscribe({
      next: (data) => {
        this.data = { x: data.x, y: data.y };
        this.openBasicModal(content);

        // Use a timeout to delay rendering until after the modal is opened
        setTimeout(() => {
          this.renderPlot(data.x, data.y);
        }, 50); // This is a 50ms delay. Adjust if necessary.
      },
      error: (error) => {
        Swal.fire("Error", "Ocurrió un error al procesar la imagen.", "error");
      },
    });
  }

  openBasicModal(content: TemplateRef<any>) {
    this.modalService.open(content, {
      size: "xl",
      windowClass: "custom-modal",
    });
  }

  renderPlot(x_data: number[], y_data: number[]): void {
    d3.select("#chart-area").selectAll("*").remove();

    const _this = this;
    const data = {
      x: x_data,
      y: y_data,
    };

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 1260 - margin.left - margin.right;
    const height = 275 - margin.top - margin.bottom;

    const svgRoot: any = d3
      .select("#chart-area")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const svg = svgRoot
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data.x)!, d3.max(data.x)!])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data.y)!, d3.max(data.y)!])
      .range([height, 0]);

    svg
      .selectAll("circle")
      .data(data.x)
      .enter()
      .append("circle")
      .attr("cx", (d: any, i: any) => xScale(data.x[i])!)
      .attr("cy", (d: any, i: any) => yScale(data.y[i])!)
      .attr("r", 2)
      .style("fill", "blue")
      .style("cursor", "pointer")
      .on("click", handlePointClick);

    this.drawnPoints.forEach((pt) => {
      svg
        .append("circle")
        .attr("cx", xScale(pt.x))
        .attr("cy", yScale(pt.y))
        .attr("r", 2)
        .style("fill", "red");
    });

    let dragStartCoords: [number, number] | null = null;
    const selectionRect = svg
      .append("rect")
      .attr("class", "selection-rect")
      .style("fill", "rgba(0, 0, 255, 0.2)")
      .style("stroke", "blue")
      .style("stroke-width", 1)
      .style("cursor", "crosshair")
      .attr("pointer-events", "all")
      .style("display", "none");

    svgRoot.on(".drag", null);

    let isMousePressed = false;

    if (this.isDrawingMode) {
      svgRoot.on("mousedown", (event: any) => {
        isMousePressed = true;
        const [x, y] = d3.pointer(event, svg.node());
        drawPoint(x, y);
      });

      svgRoot.on("mousemove", (event: any) => {
        if (isMousePressed) {
          const [x, y] = d3.pointer(event, svg.node());
          drawPoint(x, y);
        }
      });

      svgRoot.on("mouseup", () => {
        isMousePressed = false;
      });
    } else {
      svgRoot.call(
        d3
          .drag()
          .on("start", (event: any) => {
            const coords = d3.pointer(event, svg.node());
            dragStartCoords = coords;
            selectionRect
              .attr("x", dragStartCoords[0])
              .attr("y", dragStartCoords[1])
              .attr("width", 0)
              .attr("height", 0)
              .style("display", null);
          })
          .on("drag", (event: any) => {
            if (!dragStartCoords) return;
            const coords = d3.pointer(event, svg.node());
            selectionRect
              .attr("width", Math.abs(coords[0] - dragStartCoords[0]))
              .attr("height", Math.abs(coords[1] - dragStartCoords[1]))
              .attr(
                "x",
                coords[0] > dragStartCoords[0] ? dragStartCoords[0] : coords[0]
              )
              .attr(
                "y",
                coords[1] > dragStartCoords[1] ? dragStartCoords[1] : coords[1]
              );
          })
          .on("end", (event: any) => {
            if (dragStartCoords) {
              const endCoords = d3.pointer(event, svg.node());
              processSelection(dragStartCoords, endCoords);
            }
          })
      );
    }

    function drawPoint(x: number, y: number) {
      const actualX = xScale.invert(x);
      const actualY = yScale.invert(y);
      _this.drawnPoints.push({ x: actualX, y: actualY });
      data.x.push(actualX);
      data.y.push(actualY);
      svg
        .append("circle")
        .attr("cx", xScale(actualX))
        .attr("cy", yScale(actualY))
        .attr("r", 2)
        .style("fill", "red");
    }

    function handlePointClick(d: any, i: number) {
      console.log("Point clicked:", data.x[i], data.y[i]);
    }

    function processSelection(
      startCoords: [number, number],
      endCoords: [number, number]
    ) {
      const selectedPoints: [number, number][] = [];
      svg.selectAll("circle").each(function (d: any, i: any) {
        const cx = data.x[i];
        const cy = data.y[i];
        const xMouseMin = xScale.invert(Math.min(startCoords[0], endCoords[0]));
        const xMouseMax = xScale.invert(Math.max(startCoords[0], endCoords[0]));
        const yMouseMin = yScale.invert(Math.max(startCoords[1], endCoords[1]));
        const yMouseMax = yScale.invert(Math.min(startCoords[1], endCoords[1]));

        if (
          cx >= xMouseMin &&
          cx <= xMouseMax &&
          cy >= yMouseMin &&
          cy <= yMouseMax
        ) {
          selectedPoints.push([cx, cy]);
        }
      });
      _this.selectedZone = {
        x1: xScale.invert(Math.min(startCoords[0], endCoords[0])),
        y1: yScale.invert(Math.max(startCoords[1], endCoords[1])),
        x2: xScale.invert(Math.max(startCoords[0], endCoords[0])),
        y2: yScale.invert(Math.min(startCoords[1], endCoords[1])),
      };
      selectionRect.style("display", "none");
      console.log("Selected points:", selectedPoints);
    }

    svg
      .append("g")
      .call(d3.axisBottom(xScale))
      .attr("transform", `translate(0, ${height})`);

    svg.append("g").call(d3.axisLeft(yScale));
  }

  interpolateGraph(): void {
    const formData = new FormData();
    formData.append("x", JSON.stringify(this.data.x));
    formData.append("y", JSON.stringify(this.data.y));

    this.pluviogramaService.interpolateGraph(formData).subscribe(
      (response) => {
        this.data = { x: response.x, y: response.y };

        this.renderPlot(response.x, response.y);
      },
      (error) => {
        console.error("Error interpolando grafico:", error);
      }
    );
  }

  deleteSelectedPoints(): void {
    if (this.selectedZone) {
      const formData = new FormData();
      formData.append("x", JSON.stringify(this.data.x));
      formData.append("y", JSON.stringify(this.data.y));
      formData.append("x1", this.selectedZone.x1.toString());
      formData.append("y1", this.selectedZone.y1.toString());
      formData.append("x2", this.selectedZone.x2.toString());
      formData.append("y2", this.selectedZone.y2.toString());

      this.pluviogramaService.borrarPuntos(formData).subscribe(
        (response) => {
          this.data = { x: response.x, y: response.y };

          this.renderPlot(response.x, response.y);
        },
        (error) => {
          console.error("Error borrando puntos:", error);
        }
      );
    }
  }

  toggleDrawingMode(): void {
    this.isDrawingMode = !this.isDrawingMode;

    for (let point of this.drawnPoints) {
      this.data.x.push(point.x);
      this.data.y.push(point.y);
    }
    this.drawnPoints = [];

    this.renderPlot(this.data.x, this.data.y);
  }

  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }
}
