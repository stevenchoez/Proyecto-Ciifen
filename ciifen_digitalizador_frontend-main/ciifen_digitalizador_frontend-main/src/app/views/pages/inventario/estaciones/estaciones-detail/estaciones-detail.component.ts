import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Estacion } from "src/app/models/inventario/estacion.entity";
import { EstacionService } from "src/app/services/inventario/estacion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-estaciones-detail",
  templateUrl: "./estaciones-detail.component.html",
  styleUrls: ["./estaciones-detail.component.scss"],
})
export class EstacionesDetailComponent implements OnInit {
  estacion: Estacion;
  constructor(
    private estacionService: EstacionService,
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
      this.estacionService.getEstacionById(id).subscribe({
        next: (data) => {
          this.estacion = data;
        },
      });
    }
  }
}
