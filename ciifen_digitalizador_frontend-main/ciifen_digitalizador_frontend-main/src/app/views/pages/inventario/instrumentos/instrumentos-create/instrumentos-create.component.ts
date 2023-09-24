import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Instrumento } from "src/app/models/inventario/instrumento.entity";
import { InstrumentoService } from "src/app/services/inventario/instrumento.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-instrumentos-create",
  templateUrl: "./instrumentos-create.component.html",
  styleUrls: ["./instrumentos-create.component.scss"],
})
export class InstrumentosCreateComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private insrumentoService: InstrumentoService,
    private router: Router
  ) {
    this.form = this.fb.group({
      codigo: ["", [Validators.required, Validators.maxLength(50)]],
      tipo: ["", [Validators.required, Validators.maxLength(50)]],
      marca: ["", [Validators.required, Validators.maxLength(50)]],
      modelo: ["", [Validators.required, Validators.maxLength(50)]],
      serial: ["", [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {}

  crearInstrumento(instrumento: Instrumento) {
    this.insrumentoService.createInstrumento(instrumento).subscribe({
      next: (data) => {
        Swal.fire(
          "Instrumento creado",
          "Instrumento creado exitosamente",
          "success"
        ).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(["/inventario/instrumentos"]);
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
      this.crearInstrumento(this.form.value);
    } else {
      this.showFormErrors();
      this.highlightInvalidControls();
    }
  }
}
