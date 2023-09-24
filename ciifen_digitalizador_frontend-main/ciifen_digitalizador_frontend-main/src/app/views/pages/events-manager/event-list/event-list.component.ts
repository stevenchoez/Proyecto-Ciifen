import { Component, OnInit } from '@angular/core';
import { SolicitudService } from 'src/app/services/event-manager/solicitud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  solicitudes: any[] = [];
  solicitudesPablo: any[] = [];
  currentPage: number = 1;
  totalPages: number;
  totalCount: number;
  pagesArray: number[] = [];
  maxPaginationButtons: number = 5;
  searchKeyword: string = '';
  uniqueEstados: any[] = [];
  selectedEstados: any[] = ['preguntas, respuestas y aclaraciones'];

  constructor(private solicitudService: SolicitudService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarSolicitudesPablo();
    this.fetchUniqueEstados();
  }

  async cargarSolicitudes() {
    await this.solicitudService
      .getListadoSolicitudes(
        this.currentPage,
        this.searchKeyword,
        this.selectedEstados.join('|')
      )
      .subscribe(
        (data) => {
          this.solicitudes = data.results;
          this.totalCount = data.count;
          this.totalPages = Math.ceil(this.totalCount / 10);
          this.updatePagination();
        },
        (error) => {
          Swal.fire(
            'Solicitudes',
            'Error cargando el listado de solicitudes',
            'error'
          );
        }
      );
  }

  async cargarSolicitudesPablo() {
    await this.solicitudService
      .getListadoSolicitudes(
        this.currentPage,
        'norepinefrina',
        this.selectedEstados.join('|')
      )
      .subscribe(
        (data) => {
          this.solicitudesPablo = data.results;
          this.totalCount = data.count;
          this.totalPages = Math.ceil(this.totalCount / 10);
          this.updatePagination();
        },
        (error) => {
          Swal.fire(
            'Solicitudes',
            'Error cargando el listado de solicitudes',
            'error'
          );
        }
      );
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.cargarSolicitudes();
    this.cargarSolicitudesPablo();
  }

  updatePagination() {
    const half = Math.floor(this.maxPaginationButtons / 2);
    let start = this.currentPage - half;
    let end = this.currentPage + half;

    if (start < 1) {
      end += 1 - start;
      start = 1;
    }

    if (end > this.totalPages) {
      start -= end - this.totalPages;
      end = this.totalPages;
    }

    if (start < 1) {
      start = 1;
    }

    this.pagesArray = Array.from(
      { length: end - start + 1 },
      (_, i) => i + start
    );
  }

  search() {
    this.currentPage = 1;
    this.cargarSolicitudes();
    this.cargarSolicitudesPablo();
  }

  fetchUniqueEstados() {
    this.solicitudService.getUniqueEstados().subscribe(
      (data) => {
        this.uniqueEstados = data;
      },
      (error) => {
        Swal.fire(
          'Estados',
          'Error cargando los estados de solicitudes',
          'error'
        );
      }
    );
  }

  onEstadoChange(estado: string, event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      this.selectedEstados.push(estado);
    } else {
      const index = this.selectedEstados.indexOf(estado);
      if (index > -1) {
        this.selectedEstados.splice(index, 1);
      }
    }
    this.cargarSolicitudes();
    this.cargarSolicitudesPablo();
  }
}
