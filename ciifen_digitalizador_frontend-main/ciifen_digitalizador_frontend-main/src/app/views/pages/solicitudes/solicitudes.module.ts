import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudesGeneralesListComponent } from './solicitudes-generales/solicitudes-generales-list/solicitudes-generales-list.component';
import { SolicitudesGeneralesDetailComponent } from './solicitudes-generales/solicitudes-generales-detail/solicitudes-generales-detail.component';
import { SolicitudesInfimaListComponent } from './solicitudes-infima/solicitudes-infima-list/solicitudes-infima-list.component';
import { SolicitudesInfimaDetailComponent } from './solicitudes-infima/solicitudes-infima-detail/solicitudes-infima-detail.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'generales',
        component: SolicitudesGeneralesListComponent,
      },
      {
        path: 'generales/detail/:id',
        component: SolicitudesGeneralesDetailComponent,
      },
      {
        path: 'infima',
        component: SolicitudesInfimaListComponent,
      },
      {
        path: 'infima/detail/:id',
        component: SolicitudesInfimaDetailComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    SolicitudesGeneralesListComponent,
    SolicitudesGeneralesDetailComponent,
    SolicitudesInfimaListComponent,
    SolicitudesInfimaDetailComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class SolicitudesModule {}
