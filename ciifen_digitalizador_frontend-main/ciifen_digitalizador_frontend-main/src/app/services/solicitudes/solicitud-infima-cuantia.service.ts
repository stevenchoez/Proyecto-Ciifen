import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceGenerator } from '../base/service-generator';

@Injectable({ providedIn: 'root' })
export class SolicitudInfimaCuantiaService extends ServiceGenerator {
  constructor(private httpClient: HttpClient) {
    super();
  }

  getListado(page: number = 1, keyword: string = ''): Observable<any> {
    const params = new HttpParams().set('page', page).set('keyword', keyword);
    return this.httpClient.get<any>(
      this.buildurl('solicitudes/infima-cuantia/'),
      {
        params: params,
      }
    );
  }

  getTotalByFecha(days: number = 7) {
    const params = new HttpParams().set('days', days);
    return this.httpClient.get<any>(this.buildurl('reporte/infima-cuantia/'), {
      params: params,
    });
  }
}
