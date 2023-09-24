import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitudGeneralService } from 'src/app/services/solicitudes/solicitud-general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes-generales-detail',
  templateUrl: './solicitudes-generales-detail.component.html',
  styleUrls: ['./solicitudes-generales-detail.component.scss'],
})
export class SolicitudesGeneralesDetailComponent implements OnInit {
  solicitud: any;
  constructor(
    private solicitudService: SolicitudGeneralService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.solicitudService.getSolicitudById(id).subscribe({
        next: (data) => {
          this.solicitud = data;
        },
        error: (error) => {
          Swal.fire(
            'Estados',
            'Error cargando los estados de solicitudes',
            'error'
          );
        },
      });
    });
  }
}
