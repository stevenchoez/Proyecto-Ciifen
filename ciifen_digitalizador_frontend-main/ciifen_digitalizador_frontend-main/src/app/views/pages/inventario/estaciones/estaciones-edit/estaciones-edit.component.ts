import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Estacion } from "src/app/models/inventario/estacion.entity";
import { EstacionService } from "src/app/services/inventario/estacion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-estaciones-edit",
  templateUrl: "./estaciones-edit.component.html",
  styleUrls: ["./estaciones-edit.component.scss"],
})
export class EstacionesEditComponent implements OnInit {
  estacion: Estacion;
  form: FormGroup;

  constructor(
    private estacionService: EstacionService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ["", [Validators.required, Validators.maxLength(255)]],
      latitud: [
        null,
        [Validators.required, Validators.pattern(/^(-?\d{1,3}(\.\d{1,6})?)?$/)],
      ],
      longitud: [
        null,
        [Validators.required, Validators.pattern(/^(-?\d{1,4}(\.\d{1,6})?)?$/)],
      ],
      altitud: [
        null,
        [Validators.required, Validators.pattern(/^(-?\d{1,5}(\.\d{1,2})?)?$/)],
      ],
    });
  }

  ngOnInit(): void {
    this.cargarEstacion();
  }

  cargarEstacion(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      Swal.fire(
        "No se encontro",
        "No se encontro estación con ese Id",
        "error"
      );
      return; // exit the function early if no ID found
    }

    this.estacionService.getEstacionById(id).subscribe({
      next: (data) => {
        this.estacion = data;
        this.form.patchValue({
          nombre: this.estacion.nombre,
          latitud: this.estacion.latitud,
          longitud: this.estacion.longitud,
          altitud: this.estacion.altitud,
        });
      },
      error: (error) => {
        // Handle any error that might occur when fetching the data
        Swal.fire("Error", "Error obteniendo Estación.", "error");
      },
    });
  }

  actualizarEstacion(estacionData: Estacion) {
    this.estacionService
      .updateEstacion(estacionData, this.estacion.id)
      .subscribe({
        next: (data) => {
          Swal.fire(
            "Estación actualizada",
            "Estación actualizada exitosamente",
            "success"
          ).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(["/inventario/estaciones"]);
            }
          });
        },
      });
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

  highlightInvalidControls(): void {
    for (const key in this.form.controls) {
      this.form.controls[key].markAsTouched();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.actualizarEstacion(this.form.value);
    } else {
      this.showFormErrors();
      this.highlightInvalidControls();
    }
  }
}
