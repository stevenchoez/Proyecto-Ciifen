import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ServiceGenerator } from "../base/service-generator";
import { Observable } from "rxjs";
import { Instrumento } from "src/app/models/inventario/instrumento.entity";

@Injectable({
  providedIn: "root",
})
export class InstrumentoService extends ServiceGenerator {
  constructor(private httpClient: HttpClient) {
    super();
  }

  getInstrumentos(page: number = 1): Observable<any> {
    const params = new HttpParams().set("page", page);
    return this.httpClient.get<any>(this.buildurl("inventario/instrumento/"), {
      params: params,
    });
  }

  getInstrumentoById(id: string): Observable<Instrumento> {
    return this.httpClient.get<any>(
      this.buildurl(`inventario/instrumento/${id}/`)
    );
  }

  createInstrumento(instrumento: Instrumento): Observable<Instrumento> {
    return this.httpClient.post<any>(
      this.buildurl("inventario/instrumento/"),
      instrumento
    );
  }

  updateInstrumento(
    instrumentoData: Instrumento,
    id: string
  ): Observable<Instrumento> {
    return this.httpClient.patch<any>(
      this.buildurl(`inventario/instrumento/${id}/`),
      instrumentoData
    );
  }

  deleteInstrumento(id: string): Observable<Instrumento> {
    return this.httpClient.delete<any>(
      this.buildurl(`inventario/instrumento/${id}/`)
    );
  }
}
