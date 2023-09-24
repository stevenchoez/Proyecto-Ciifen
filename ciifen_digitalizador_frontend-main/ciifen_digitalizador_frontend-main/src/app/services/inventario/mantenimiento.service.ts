import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceGenerator } from "../base/service-generator";
import { Matenimiento } from "src/app/models/inventario/mantenimiento.entity";

@Injectable({
  providedIn: "root",
})
export class MantenimientoService extends ServiceGenerator {
  constructor(private httpClient: HttpClient) {
    super();
  }

  createMantenimiento(mantenimiento: Matenimiento): Observable<Matenimiento> {
    return this.httpClient.post<any>(
      this.buildurl("inventario/mantenimiento/"),
      mantenimiento
    );
  }

  updateMantenimiento(
    mantenimientoData: Matenimiento,
    id: string
  ): Observable<Matenimiento> {
    return this.httpClient.patch<any>(
      this.buildurl(`inventario/mantenimiento/${id}/`),
      mantenimientoData
    );
  }

  deleteMantenimiento(id: string): Observable<Matenimiento> {
    return this.httpClient.delete<any>(
      this.buildurl(`inventario/mantenimiento/${id}/`)
    );
  }
}
