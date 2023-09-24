import { Matenimiento } from "./mantenimiento.entity";

export class Instrumento {
  id: string;
  codigo: string;
  tipo: string;
  marca: string;
  modelo: string;
  serial: string;
  mantenimientos: Matenimiento[];
}
