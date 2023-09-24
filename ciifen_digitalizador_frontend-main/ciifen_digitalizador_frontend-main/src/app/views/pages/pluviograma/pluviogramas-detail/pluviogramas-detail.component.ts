import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Pluviograma } from "src/app/models/pluviograma/pluviograma.entity";
import { PluviogramaService } from "src/app/services/pluviograma/pluviograma.service";
import Swal from "sweetalert2";
import * as d3 from "d3";
import { Selection } from "d3-selection";

@Component({
  selector: "app-pluviogramas-detail",
  templateUrl: "./pluviogramas-detail.component.html",
  styleUrls: ["./pluviogramas-detail.component.scss"],
})
export class PluviogramasDetailComponent implements OnInit {
  pluviograma: Pluviograma;
  imageUrl = "";
  activeTab: string = "chart";
  data: { x: any[]; y: any[] } = { x: [], y: [] };
  time_series_intervals: { tiempo: string; cantidad: number }[] = [];
  
  constructor(
    private pluviogramaService: PluviogramaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      Swal.fire(
        "No se encontro",
        "No se encontro estación con ese Id",
        "error"
      );
    } else {
      this.pluviogramaService.getPluviogramaById(id).subscribe({
        next: (data) => {
          this.pluviograma = data;
          this.imageUrl = `http://localhost:8000/api/v1/media/ciifen/pluviograma/trazabilidades/${id}/${this.pluviograma.url_serie_tiempo}`;
          if (id) {
            this.pluviogramaService
              .getTrazabilidad(id, this.pluviograma.url_trazabilidad)
              .subscribe((responseData: any) => {
                this.data.x = responseData.x;
                this.data.y = responseData.y;
                this.renderPlot(this.data.x, this.data.y);
                this.getTimeSeriesInterval();
              });
          }
        },
      });
    }
  }

  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

  renderPlot(x_data: number[], y_data: number[]): void {
    d3.select("#chart-area").selectAll("*").remove();

    const _this = this;
    const data = {
      x: x_data,
      y: y_data,
    };

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 1000 - margin.left - margin.right;
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
      .style("cursor", "pointer");
  }

  getTimeSeriesInterval(): void {
    const formData = new FormData();
    formData.append("x", JSON.stringify(this.data.x));
    formData.append("y", JSON.stringify(this.data.y));
    formData.append("horaManual", JSON.stringify(this.pluviograma.fecha_inicio));
    formData.append("desfase", JSON.stringify(this.pluviograma.ruta));


    const objetoModelo = JSON.stringify(this.pluviograma.modelo);
    const objeto = JSON.parse(objetoModelo);

    const horaModelo =objeto.hora_inicio;
    formData.append("horaModelo", JSON.stringify(horaModelo));

    const limiteInferior =objeto.limite_inferior;
    formData.append("limiteInferior", JSON.stringify(limiteInferior));


    this.pluviogramaService.getTimeSeriesInterval(formData).subscribe(
      (response: any) => {
        this.time_series_intervals = response.output_str.tiempo.map(
          (t: any, index: any) => {
            return { tiempo: t, cantidad: response.output_str.cantidad[index] };
          }
        );
      },
      (error) => {
        console.error("Error obteniendo Time Series", error);
      }
    );
  }
}
