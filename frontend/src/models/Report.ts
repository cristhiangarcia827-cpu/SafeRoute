export interface Report {
  id: string;
  lugar: string;
  tipoIncidente: string;
  descripcion: string;
  fecha: string;
  latitude?: number;
  longitude?: number;
}

export type IncidenteType = 'Robo' | 'Asalto' | 'Acoso' | 'Zona Oscura' | 'Otro';