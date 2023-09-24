import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  urlBase = environment.serverurl;

  constructor(private http: HttpClient) {}

  getListadoSolicitudes(
    page: number = 1,
    keyword: string = '',
    selectedEstados: string = ''
  ): Observable<any> {
    return this.http.get<any>(
      `${this.urlBase}solicitudes/?page=${page}&keyword=${keyword}&selectedEstados=${selectedEstados}`
    );
  }

  getUniqueEstados(): Observable<any> {
    return this.http.get<any>(this.urlBase + 'solicitudes/estados/');
  }
}
