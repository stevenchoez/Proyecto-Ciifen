import { Estacion } from "../inventario/estacion.entity";
import { Instrumento } from "../inventario/instrumento.entity";

export class Pluviograma {
  id: string;
  fecha_inicio: string;
  fecha_fin: string;
  modelo: JSON;
  ruta: JSON;
  estacion: Estacion;
  instrumento: Instrumento;
  url_trazabilidad: string;
  url_serie_tiempo: string;
  x: any[];
  y: any[];
}
