import { Component, OnInit } from "@angular/core";
import { Instrumento } from "src/app/models/inventario/instrumento.entity";
import { InstrumentoService } from "src/app/services/inventario/instrumento.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-instrumentos-list",
  templateUrl: "./instrumentos-list.component.html",
  styleUrls: ["./instrumentos-list.component.scss"],
})
export class InstrumentosListComponent implements OnInit {
  instrumentos: Instrumento[];
  constructor(private instrumentoService: InstrumentoService) {}

  ngOnInit(): void {
    this.cargarInstrumentos();
  }

  cargarInstrumentos(): void {
    this.instrumentoService.getInstrumentos().subscribe({
      next: (data) => {
        this.instrumentos = data.results;
      },
      error: (error) => {
        Swal.fire("Instrumento", "Error cargando los instrumentos", "error");
      },
    });
  }

  borrarInstrumento(instrumento: Instrumento) {
    Swal.fire({
      title: "¿Seguro quieres borrar?",
      html: `
      <p>Estarias borrando el instrumento "${instrumento.codigo}"</p>
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
        this.instrumentoService.deleteInstrumento(instrumento.id).subscribe({
          next: () => {
            Swal.fire({
              title: "Instrumento",
              text: "El instrumento fue borrado",
              icon: "success",
            });
            this.cargarInstrumentos();
          },
          error: (error) => {
            Swal.fire("Instrumento", "Error borrando el instrumento", "error");
          },
        });
      }
    });
  }
}
