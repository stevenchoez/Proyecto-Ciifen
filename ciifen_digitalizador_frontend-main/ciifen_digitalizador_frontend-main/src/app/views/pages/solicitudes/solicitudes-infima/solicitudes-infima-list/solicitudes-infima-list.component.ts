import { Component, OnInit } from '@angular/core';
import { SolicitudInfimaCuantiaService } from 'src/app/services/solicitudes/solicitud-infima-cuantia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes-infima-list',
  templateUrl: './solicitudes-infima-list.component.html',
  styleUrls: ['./solicitudes-infima-list.component.scss'],
})
export class SolicitudesInfimaListComponent implements OnInit {
  solicitudes: any[] = [];
  currentPage: number = 1;
  totalPages: number;
  totalCount: number;
  pagesArray: number[] = [];
  maxPaginationButtons: number = 5;
  searchKeyword: string = '';

  constructor(
    private solicitudInfimaCuantiaService: SolicitudInfimaCuantiaService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarSolicitudesInfima();
  }

  async cargarSolicitudesInfima() {
    this.solicitudInfimaCuantiaService
      .getListado(this.currentPage, this.searchKeyword)
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

  search() {
    this.currentPage = 1;
    this.cargarSolicitudesInfima();
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.cargarSolicitudesInfima();
  }
}
