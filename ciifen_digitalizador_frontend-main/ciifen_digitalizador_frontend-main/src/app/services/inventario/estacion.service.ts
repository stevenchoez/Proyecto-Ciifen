import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceGenerator } from "../base/service-generator";
import { Estacion } from "src/app/models/inventario/estacion.entity";

@Injectable({
  providedIn: "root",
})
export class EstacionService extends ServiceGenerator {
  constructor(private httpClient: HttpClient) {
    super();
  }

  getEstaciones(page: number = 1): Observable<any> {
    const params = new HttpParams().set("page", page);
    return this.httpClient.get<any>(this.buildurl("inventario/estacion/"), {
      params: params,
    });
  }

  getEstacionById(id: string): Observable<Estacion> {
    return this.httpClient.get<any>(
      this.buildurl(`inventario/estacion/${id}/`)
    );
  }

  createEstacion(estacion: Estacion): Observable<Estacion> {
    return this.httpClient.post<any>(
      this.buildurl("inventario/estacion/"),
      estacion
    );
  }

  updateEstacion(estacionData: Estacion, id: string): Observable<Estacion> {
    return this.httpClient.patch<any>(
      this.buildurl(`inventario/estacion/${id}/`),
      estacionData
    );
  }

  deleteEstacion(id: string): Observable<Estacion> {
    return this.httpClient.delete<any>(
      this.buildurl(`inventario/estacion/${id}/`)
    );
  }
}
