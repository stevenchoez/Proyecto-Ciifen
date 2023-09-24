import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudGeneralService } from 'src/app/services/solicitudes/solicitud-general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes-generales-list',
  templateUrl: './solicitudes-generales-list.component.html',
  styleUrls: ['./solicitudes-generales-list.component.scss'],
})
export class SolicitudesGeneralesListComponent implements OnInit {
  solicitudes: any[] = [];
  currentPage: number = 1;
  totalPages: number;
  totalCount: number;
  pagesArray: number[] = [];
  maxPaginationButtons: number = 5;
  searchKeyword: string = '';
  optionsEstados: any[] = [];
  selectedEstados: any[] = ['preguntas, respuestas y aclaraciones'];

  constructor(
    private solicitudService: SolicitudGeneralService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarOptionsEstados();
    await this.cargarSolicitudes();
  }

  async cargarSolicitudes() {
    this.solicitudService
      .getListado(
        this.currentPage,
        this.searchKeyword,
        this.selectedEstados.join('|')
      )
      .subscribe(
        (data) => {
          this.solicitudes = data.results;
          this.totalCount = data.count;
          this.totalPages = Math.ceil(this.totalCount / 25);
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

  async cargarOptionsEstados() {
    this.solicitudService.getOptionsEstados().subscribe(
      (data) => {
        this.optionsEstados = data;
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
  }

  search() {
    this.currentPage = 1;
    this.cargarSolicitudes();
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.cargarSolicitudes();
  }

  goToDetail(id: string) {
    this.router.navigateByUrl(`/solicitudes/generales/detail/${id}`);
  }
}
