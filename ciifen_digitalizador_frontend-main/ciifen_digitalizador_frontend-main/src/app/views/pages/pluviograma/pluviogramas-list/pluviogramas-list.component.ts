import { Component, OnInit } from "@angular/core";
import { Pluviograma } from "src/app/models/pluviograma/pluviograma.entity";
import { PluviogramaService } from "src/app/services/pluviograma/pluviograma.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-pluviogramas-list",
  templateUrl: "./pluviogramas-list.component.html",
  styleUrls: ["./pluviogramas-list.component.scss"],
})
export class PluviogramasListComponent implements OnInit {
  pluviogramas: Pluviograma[];

  constructor(private pluviogramaService: PluviogramaService) {}

  ngOnInit(): void {
    this.cargarPluviogramas();
  }

  cargarPluviogramas(): void {
    this.pluviogramaService.getPluviogramas().subscribe({
      next: (data) => {
        this.pluviogramas = data.results;
      },
      error: (error) => {
        Swal.fire("Pluviograma", "Error cargando los pluviogramas", "error");
      },
    });
  }

  borrarPluviograma(pluviograma: Pluviograma) {
    Swal.fire({
      title: "¿Seguro quieres borrar?",
      html: `
      <p>Estarias borrando el pluviograma "${pluviograma.fecha_inicio} ${pluviograma.modelo}"</p>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.pluviogramaService.deletePluviograma(pluviograma.id).subscribe({
          next: () => {
            Swal.fire({
              title: "Pluviograma",
              text: "El pluviograma fue borrado",
              icon: "success",
            });
            this.cargarPluviogramas();
          },
          error: (error) => {
            Swal.fire("Pluviograma", "Error borrando el pluviograma", "error");
          },
        });
      }
    });
  }
}
