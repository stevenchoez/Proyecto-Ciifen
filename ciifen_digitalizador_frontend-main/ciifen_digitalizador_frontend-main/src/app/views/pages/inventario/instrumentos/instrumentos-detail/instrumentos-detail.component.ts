import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Instrumento } from "src/app/models/inventario/instrumento.entity";
import { Matenimiento } from "src/app/models/inventario/mantenimiento.entity";
import { InstrumentoService } from "src/app/services/inventario/instrumento.service";
import { MantenimientoService } from "src/app/services/inventario/mantenimiento.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-instrumentos-detail",
  templateUrl: "./instrumentos-detail.component.html",
  styleUrls: ["./instrumentos-detail.component.scss"],
})
export class InstrumentosDetailComponent implements OnInit {
  instrumento: Instrumento;
  form: FormGroup;
  basicModalCloseResult: string = "";
  modalRef: any;
  isEdit: boolean = false;
  currentMantenimiento: Matenimiento | null = null;

  constructor(
    private fb: FormBuilder,
    private instrumentoService: InstrumentoService,
    private route: ActivatedRoute,
    private mantenimientoService: MantenimientoService,
    private modalService: NgbModal
  ) {
    this.form = this.fb.group({
      tipo: ["", [Validators.required, Validators.maxLength(50)]],
      fecha: ["", [Validators.required, Validators.maxLength(50)]],
      detalle: ["", [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.cargarInstrumento();
  }

  cargarInstrumento(): void {
    var id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      Swal.fire(
        "No se encontro",
        "No se encontro instrumento con ese Id",
        "error"
      );
    } else {
      this.instrumentoService.getInstrumentoById(id).subscribe({
        next: (data) => {
          this.instrumento = data;
        },
      });
    }
  }

  openBasicModal(content: TemplateRef<any>) {
    this.isEdit = false;
    this.form.reset();
    this.modalRef = this.modalService.open(content, {});
  }

  openEditModal(content: TemplateRef<any>, mantenimiento: Matenimiento) {
    this.isEdit = true;
    this.currentMantenimiento = mantenimiento;
    this.form.patchValue({
      tipo: mantenimiento.tipo,
      fecha: this.convertToDatetimeLocal(mantenimiento.fecha),
      detalle: mantenimiento.detalle,
    });
    this.modalRef = this.modalService.open(content, {});
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEdit && this.currentMantenimiento) {
        this.actualizarMantenimiento(this.form.value);
      } else {
        this.crearMantenimiento(this.form.value);
      }
    } else {
      this.showFormErrors();
    }
  }

  // Add this function to handle updating mantenimientos
  actualizarMantenimiento(mantenimiento: Matenimiento) {
    if (this.currentMantenimiento) {
      mantenimiento.id = this.currentMantenimiento.id;
      // Call your service to update the mantenimiento
      this.mantenimientoService
        .updateMantenimiento(mantenimiento, mantenimiento.id)
        .subscribe({
          next: () => {
            Swal.fire(
              "Mantenimiento actualizado",
              "Mantenimiento actualizado exitosamente",
              "success"
            );
            this.modalRef.close();
            this.cargarInstrumento();
          },
          // handle error here
        });
    }
  }

  crearMantenimiento(mantenimiento: Matenimiento) {
    var idInstrumento = this.route.snapshot.paramMap.get("id");
    if (!idInstrumento) {
      Swal.fire("No se encontro", "No se encontro Id del instrumento", "error");
    } else {
      mantenimiento.instrumento = idInstrumento;
      this.mantenimientoService.createMantenimiento(mantenimiento).subscribe({
        next: () => {
          Swal.fire(
            "Mantenimiento creado",
            "Mantenimiento creado exitosamente",
            "success"
          ).then((result) => {
            this.cargarInstrumento();
          });
          this.modalRef.close(); // Close the modal here
        },
      });
    }
  }

  showFormErrors(): void {
    let errorMessage = "";
    for (const key in this.form.controls) {
      if (this.form.controls[key].invalid) {
        errorMessage += `Campo ${key} es inválido.<br>`;
      }
    }

    Swal.fire({
      icon: "error",
      title: "Error en el formulario",
      html: errorMessage,
    });
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

  borrarMantenimiento(mantenimiento: Matenimiento) {
    Swal.fire({
      title: "¿Seguro quieres borrar?",
      html: `
      <p>Estarias borrando el matenimiento "${mantenimiento.fecha} ${mantenimiento.tipo}"</p>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.mantenimientoService
          .deleteMantenimiento(mantenimiento.id)
          .subscribe({
            next: () => {
              Swal.fire({
                title: "Mantenimiento",
                text: "El mantenimiento fue borrada",
                icon: "success",
              });
              // Fetch the updated list of stations here
              this.cargarInstrumento();
            },
            error: (error) => {
              // Handle any errors that occur during the delete
              Swal.fire(
                "Mantenimiento",
                "Error borrando el mantenimiento",
                "error"
              );
            },
          });
      }
    });
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
}
