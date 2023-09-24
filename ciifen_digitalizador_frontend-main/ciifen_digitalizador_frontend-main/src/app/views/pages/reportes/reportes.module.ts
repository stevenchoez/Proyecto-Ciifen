import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesDashboardComponent } from './reportes-dashboard.component';
import { ReporteSolicitudesTotalComponent } from './reporte-solicitudes-total/reporte-solicitudes-total.component';
import { RouterModule, Routes } from '@angular/router';

import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import {
  NgbDropdownModule,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

// Ng-ApexCharts

import { NgApexchartsModule } from 'ng-apexcharts';
import { ReporteInfimaCuantiaTotalComponent } from './reporte-infima-cuantia-total/reporte-infima-cuantia-total.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: ReportesDashboardComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [ReportesDashboardComponent, ReporteSolicitudesTotalComponent, ReporteInfimaCuantiaTotalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgApexchartsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    FeatherIconModule,
  ],
})
export class ReportesModule {}
