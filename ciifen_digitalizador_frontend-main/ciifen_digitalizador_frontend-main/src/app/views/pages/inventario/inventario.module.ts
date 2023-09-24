import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EstacionesListComponent } from "./estaciones/estaciones-list/estaciones-list.component";
import { RouterModule, Routes } from "@angular/router";
import { EstacionesCreateComponent } from "./estaciones/estaciones-create/estaciones-create.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EstacionesDetailComponent } from "./estaciones/estaciones-detail/estaciones-detail.component";
import { FeatherIconModule } from "src/app/core/feather-icon/feather-icon.module";
import { EstacionesEditComponent } from "./estaciones/estaciones-edit/estaciones-edit.component";
import { InstrumentosListComponent } from "./instrumentos/instrumentos-list/instrumentos-list.component";
import { InstrumentosCreateComponent } from "./instrumentos/instrumentos-create/instrumentos-create.component";
import { InstrumentosDetailComponent } from "./instrumentos/instrumentos-detail/instrumentos-detail.component";
import { InstrumentosEditComponent } from "./instrumentos/instrumentos-edit/instrumentos-edit.component";

const routes: Routes = [
  {
    path: "estaciones",
    children: [
      {
        path: "",
        component: EstacionesListComponent,
      },
      {
        path: "create",
        component: EstacionesCreateComponent,
      },
      {
        path: ":id",
        component: EstacionesDetailComponent,
      },
      {
        path: ":id/edit",
        component: EstacionesEditComponent,
      },
    ],
  },
  {
    path: "instrumentos",
    children: [
      {
        path: "",
        component: InstrumentosListComponent,
      },
      {
        path: "create",
        component: InstrumentosCreateComponent,
      },
      {
        path: ":id",
        component: InstrumentosDetailComponent,
      },
      {
        path: ":id/edit",
        component: InstrumentosEditComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    EstacionesListComponent,
    EstacionesCreateComponent,
    EstacionesDetailComponent,
    EstacionesEditComponent,
    InstrumentosListComponent,
    InstrumentosCreateComponent,
    InstrumentosDetailComponent,
    InstrumentosEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    FeatherIconModule,
  ],
})
export class InventarioModule {}
