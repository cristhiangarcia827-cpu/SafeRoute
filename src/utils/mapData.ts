export interface NodePosition {
  id: string;
  name: string;
  x: number; // porcentaje del ancho de la pantalla (0-100)
  y: number; // porcentaje del alto
}

export const nodePositions: NodePosition[] = [
  { id: '1', name: 'Casa', x: 20, y: 30 },
  { id: '2', name: 'Universidad', x: 50, y: 20 },
  { id: '3', name: 'Parque', x: 30, y: 60 },
  { id: '4', name: 'Hospital', x: 70, y: 40 },
  { id: '5', name: 'Centro Comercial', x: 60, y: 70 },
  { id: '6', name: 'Biblioteca', x: 40, y: 80 },
  { id: '7', name: 'Estación de Policía', x: 80, y: 60 },
];

// Conexiones (mismas que en routesData.ts)
export const connections = [
  { from: '1', to: '2' },
  { from: '1', to: '3' },
  { from: '2', to: '4' },
  { from: '2', to: '5' },
  { from: '3', to: '6' },
  { from: '4', to: '7' },
  { from: '5', to: '6' },
  { from: '5', to: '7' },
  { from: '6', to: '3' },
];