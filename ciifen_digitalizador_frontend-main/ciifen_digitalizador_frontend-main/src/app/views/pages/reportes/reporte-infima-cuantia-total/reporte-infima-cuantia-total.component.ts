import { Component, OnInit } from '@angular/core';
import { SolicitudGeneralService } from 'src/app/services/solicitudes/solicitud-general.service';
import { SolicitudInfimaCuantiaService } from 'src/app/services/solicitudes/solicitud-infima-cuantia.service';

@Component({
  selector: 'app-reporte-infima-cuantia-total',
  templateUrl: './reporte-infima-cuantia-total.component.html',
  styleUrls: ['./reporte-infima-cuantia-total.component.scss'],
})
export class ReporteInfimaCuantiaTotalComponent implements OnInit {
  monthlySalesChartOptions: any = {};

  totales: any = [];
  fechas: any = [];

  selectedRango: number = 29;

  obj = {
    primary: '#EDC418',
    secondary: '#7987a1',
    success: '#05a34a',
    info: '#66d1d1',
    warning: '#fbbc06',
    danger: '#ff3366',
    light: '#e9ecef',
    dark: '#060c17',
    muted: '#7987a1',
    gridBorder: 'rgba(77, 138, 240, .15)',
    bodyColor: '#000',
    cardBg: '#fff',
    fontFamily: "'Roboto', Helvetica, sans-serif",
  };
  constructor(private infimaCuantiadService: SolicitudInfimaCuantiaService) {}

  ngOnInit(): void {
    this.getTotalByFechaRango(29);
  }

  getTotalByFechaRango(days: number): void {
    this.selectedRango = days;
    this.totales = [];
    this.fechas = [];
    this.infimaCuantiadService.getTotalByFecha(days).subscribe({
      next: (data) => {
        data.forEach((element: any) => {
          this.totales.push(element['count']);
          this.fechas.push(element['fecha_emision']);
        });
        this.monthlySalesChartOptions = this.getMonthlySalesChartOptions(
          this.obj
        );
      },
    });
  }

  getMonthlySalesChartOptions(obj: any) {
    return {
      series: [
        {
          name: 'Cantidad',
          data: this.totales,
        },
      ],
      chart: {
        type: 'bar',
        height: '318',
        parentHeightOffset: 0,
        foreColor: obj.bodyColor,
        background: obj.cardBg,
        toolbar: {
          show: false,
        },
      },
      colors: [obj.primary],
      fill: {
        opacity: 0.9,
      },
      grid: {
        padding: {
          bottom: -4,
        },
        borderColor: obj.gridBorder,
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        type: '',
        categories: this.fechas,
        axisBorder: {
          color: obj.gridBorder,
        },
        axisTicks: {
          color: obj.gridBorder,
        },
      },
      yaxis: {
        title: {
          text: 'Cantidad de Ordernes Infima Cuantia',
          style: {
            size: 9,
            color: obj.muted,
          },
        },
        labels: {
          offsetX: 0,
        },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        fontFamily: obj.fontFamily,
        itemMargin: {
          horizontal: 8,
          vertical: 0,
        },
      },
      stroke: {
        width: 0,
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontFamily: obj.fontFamily,
        },
        offsetY: -27,
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 4,
          dataLabels: {
            position: 'top',
            orientation: 'vertical',
          },
        },
      },
    };
  }
}
