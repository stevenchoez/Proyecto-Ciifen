import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Instrumento } from "src/app/models/inventario/instrumento.entity";
import { InstrumentoService } from "src/app/services/inventario/instrumento.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-instrumentos-edit",
  templateUrl: "./instrumentos-edit.component.html",
  styleUrls: ["./instrumentos-edit.component.scss"],
})
export class InstrumentosEditComponent implements OnInit {
  instrumento: Instrumento;
  form: FormGroup;

  constructor(
    private estacionService: InstrumentoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      codigo: ["", [Validators.required, Validators.maxLength(50)]],
      tipo: ["", [Validators.required, Validators.maxLength(50)]],
      marca: ["", [Validators.required, Validators.maxLength(50)]],
      modelo: ["", [Validators.required, Validators.maxLength(50)]],
      serial: ["", [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.cargarInstrumento();
  }

  cargarInstrumento(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      Swal.fire(
        "No se encontro",
        "No se encontro estación con ese Id",
        "error"
      );
      return; // exit the function early if no ID found
    }

    this.estacionService.getInstrumentoById(id).subscribe({
      next: (data) => {
        this.instrumento = data;
        this.form.patchValue({
          codigo: this.instrumento.codigo,
          tipo: this.instrumento.tipo,
          marca: this.instrumento.marca,
          modelo: this.instrumento.modelo,
          serial: this.instrumento.serial,
        });
      },
      error: (error) => {
        // Handle any error that might occur when fetching the data
        Swal.fire("Error", "Error obteniendo Instrumento.", "error");
      },
    });
  }

  actualizarInstrumento(instrumentoData: Instrumento) {
    this.estacionService
      .updateInstrumento(instrumentoData, this.instrumento.id)
      .subscribe({
        next: (data) => {
          Swal.fire(
            "Instrumento actualizado",
            "Instrumento actualizado exitosamente",
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
      this.actualizarInstrumento(this.form.value);
    } else {
      this.showFormErrors();
      this.highlightInvalidControls();
    }
  }
}
