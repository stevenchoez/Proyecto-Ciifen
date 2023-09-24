import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Estacion } from "src/app/models/inventario/estacion.entity";
import { EstacionService } from "src/app/services/inventario/estacion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-estaciones-create",
  templateUrl: "./estaciones-create.component.html",
  styleUrls: ["./estaciones-create.component.scss"],
})
export class EstacionesCreateComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private estacionService: EstacionService,
    private router: Router
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

  ngOnInit(): void {}

  crearEstacion(estacion: Estacion) {
    this.estacionService.createEstacion(estacion).subscribe({
      next: (data) => {
        Swal.fire(
          "Estación creada",
          "Estación creada exitosamente",
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
      this.crearEstacion(this.form.value);
    } else {
      this.showFormErrors();
      this.highlightInvalidControls();
    }
  }
}
