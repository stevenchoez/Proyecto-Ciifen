import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PluviogramasListComponent } from "./pluviogramas-list/pluviogramas-list.component";
import { RouterModule, Routes } from "@angular/router";
import { FeatherIconModule } from "src/app/core/feather-icon/feather-icon.module";
import { PluviogramasCreateComponent } from "./pluviogramas-create/pluviogramas-create.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PluviogramasDetailComponent } from "./pluviogramas-detail/pluviogramas-detail.component";
import { PluviogramasEditComponent } from "./pluviogramas-edit/pluviogramas-edit.component";
import { EstacionesEditComponent } from "../inventario/estaciones/estaciones-edit/estaciones-edit.component";

const routes: Routes = [
  {
    path: "",
    component: PluviogramasListComponent,
  },
  {
    path: "create",
    component: PluviogramasCreateComponent,
  },
  {
    path: ":id",
    component: PluviogramasDetailComponent,
  },
  {
    path: ":id/edit",
    component: PluviogramasEditComponent,
  },
];

@NgModule({
  declarations: [
    PluviogramasListComponent,
    PluviogramasCreateComponent,
    PluviogramasDetailComponent,
    PluviogramasEditComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FeatherIconModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class PluviogramaModule {}
