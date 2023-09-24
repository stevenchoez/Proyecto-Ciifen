import { Component, OnInit } from "@angular/core";
import { Estacion } from "src/app/models/inventario/estacion.entity";
import { EstacionService } from "src/app/services/inventario/estacion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-estaciones-list",
  templateUrl: "./estaciones-list.component.html",
  styleUrls: ["./estaciones-list.component.scss"],
})
export class EstacionesListComponent implements OnInit {
  estaciones: Estacion[];
  constructor(private estacionService: EstacionService) {}

  ngOnInit(): void {
    this.cargarEstaciones();
  }

  cargarEstaciones(): void {
    this.estacionService.getEstaciones().subscribe({
      next: (data) => {
        this.estaciones = data.results;
      },
      error: (error) => {
        Swal.fire("Estación", "Error cargando las Estaciones", "error");
      },
    });
  }

  borrarEstacion(estacion: Estacion) {
    Swal.fire({
      title: "¿Seguro quieres borrar?",
      html: `
      <p>Estarias borrando la estación "${estacion.nombre}"</p>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      // preConfirm: () => {
      //   const selectElement = document.getElementById(
      //     "selectElement"
      //   ) as HTMLSelectElement;
      //   const selectedValue = selectElement.value;
      //   if (!selectedValue) {
      //     Swal.showValidationMessage("Por favor selecciona un valor");
      //     return false;
      //   }
      //   return selectedValue;
      // },
    }).then((result) => {
      if (result.isConfirmed) {
        this.estacionService.deleteEstacion(estacion.id).subscribe({
          next: () => {
            Swal.fire({
              title: "Estación",
              text: "La estación fue borrada",
              icon: "success",
            });
            // Fetch the updated list of stations here
            this.cargarEstaciones();
          },
          error: (error) => {
            // Handle any errors that occur during the delete
            Swal.fire("Estación", "Error borrando la estación", "error");
          },
        });
      }
    });
  }
}
