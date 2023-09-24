import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceGenerator } from "../base/service-generator";
import { Pluviograma } from "src/app/models/pluviograma/pluviograma.entity";

@Injectable({
  providedIn: "root",
})
export class PluviogramaService extends ServiceGenerator {
  constructor(private httpClient: HttpClient) {
    super();
  }

  getPluviogramas(page: number = 1): Observable<any> {
    const params = new HttpParams().set("page", page);
    return this.httpClient.get<any>(this.buildurl("pluviograma/"), {
      params: params,
    });
  }

  getPluviogramaById(id: string): Observable<Pluviograma> {
    return this.httpClient.get<any>(this.buildurl(`pluviograma/${id}/`));
  }

  createPluviograma(instrumento: Pluviograma): Observable<Pluviograma> {
    return this.httpClient.post<any>(
      this.buildurl("pluviograma/"),
      instrumento
    );
  }

  updatePluviograma(
    pluviogramaData: Pluviograma,
    id: string
  ): Observable<Pluviograma> {
    return this.httpClient.patch<any>(
      this.buildurl(`pluviograma/${id}/`),
      pluviogramaData
    );
  }

  deletePluviograma(id: string): Observable<Pluviograma> {
    return this.httpClient.delete<any>(this.buildurl(`pluviograma/${id}/`));
  }

  digitalizarImagen(formData: FormData): Observable<any> {
    const endpointUrl = this.buildurl("pluviograma/upload/");
    return this.httpClient.post<any>(endpointUrl, formData);
  }

  borrarPuntos(formData: FormData): Observable<any> {
    const endpointUrl = this.buildurl("pluviograma/delete/");
    return this.httpClient.post<any>(endpointUrl, formData);
  }

  interpolateGraph(formData: FormData): Observable<any> {
    const endpointUrl = this.buildurl("pluviograma/interpolate/");
    return this.httpClient.post<any>(endpointUrl, formData);
  }

  generateTimeSeriesImage(formData: FormData): Observable<any> {
    const endpointUrl = this.buildurl("pluviograma/time-series/");
    return this.httpClient.post<any>(endpointUrl, formData);
  }

  getTrazabilidad(id: string, url_trazabilidad: string): Observable<any> {
    const endpointUrl = this.buildurl(
      `media/ciifen/pluviograma/trazabilidades/${id}/${url_trazabilidad}/`
    );
    return this.httpClient.get<any>(endpointUrl);
  }

  getTimeSeriesInterval(formData: FormData): Observable<any> {
    const endpointUrl = this.buildurl("pluviograma/time-series-intervals/");
    return this.httpClient.post<any>(endpointUrl, formData);
  }
}
