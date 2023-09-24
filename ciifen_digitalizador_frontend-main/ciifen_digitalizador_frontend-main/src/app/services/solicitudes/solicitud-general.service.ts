import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceGenerator } from '../base/service-generator';

@Injectable({ providedIn: 'root' })
export class SolicitudGeneralService extends ServiceGenerator {
  constructor(private httpClient: HttpClient) {
    super();
  }

  getOptionsEstados(): Observable<any> {
    return this.httpClient.get<any>(this.buildurl('solicitudes/estados/'));
  }

  getListado(
    page: number = 1,
    keyword: string = '',
    selectedEstados: string = ''
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('keyword', keyword)
      .set('selectedEstados', selectedEstados);
    return this.httpClient.get<any>(this.buildurl('solicitudes/'), {
      params: params,
    });
  }

  getSolicitudById(id: string) {
    return this.httpClient.get<any>(this.buildurl(`solicitudes/${id}/`));
  }

  getTotalByFecha(days: number = 7) {
    const params = new HttpParams().set('days', days);
    return this.httpClient.get<any>(this.buildurl('reporte/solicitudes/'), {
      params: params,
    });
  }
}
