import { Graph } from '../dataStructures/Graph';
import { nodePositions } from './mapData';

export const cityGraph = new Graph();

export const lugares = [
  { id: '1', nombre: 'Plaza Norte' },
  { id: '2', nombre: 'Estación Norte' },
  { id: '3', nombre: 'Mirador' },
  { id: '4', nombre: 'Universidad Norte' },
  { id: '5', nombre: 'Parque Norte' },
  { id: '6', nombre: 'Mercado Central' },
  { id: '7', nombre: 'Centro' },
  { id: '8', nombre: 'Catedral' },
  { id: '9', nombre: 'Biblioteca Central' },
  { id: '10', nombre: 'Centro Comercial' },
  { id: '11', nombre: 'Terminal' },
  { id: '12', nombre: 'Plaza Mayor' },
  { id: '13', nombre: 'Hospital' },
  { id: '14', nombre: 'Estadio' },
  { id: '15', nombre: 'Zona Industrial' },
  { id: '16', nombre: 'Barrio Sur' },
  { id: '17', nombre: 'Universidad Sur' },
  { id: '18', nombre: 'Parque Sur' },
  { id: '19', nombre: 'Comisaría' },
  { id: '20', nombre: 'Parque Industrial' },
  { id: '21', nombre: 'Puente Viejo' },
  { id: '22', nombre: 'Mercado Sur' },
  { id: '23', nombre: 'Biblioteca Sur' },
  { id: '24', nombre: 'Centro Cívico' },
  { id: '25', nombre: 'Terminal Sur' },
];

export const nombreToId: Record<string, string> = {};
lugares.forEach(lugar => { nombreToId[lugar.nombre] = lugar.id; });

// Agregar lugares al grafo
lugares.forEach(lugar => cityGraph.agregarLugar(lugar.id, lugar.nombre));

// Generar conexiones basadas en la cuadrícula
const conexionesSet = new Set<string>();

// Agrupar por coordenada Y
const porY: Record<number, string[]> = {};
Object.entries(nodePositions).forEach(([id, pos]) => {
  if (!porY[pos.y]) porY[pos.y] = [];
  porY[pos.y].push(id);
});

Object.values(porY).forEach(grupo => {
  for (let i = 0; i < grupo.length; i++) {
    for (let j = i + 1; j < grupo.length; j++) {
      conexionesSet.add(`${grupo[i]}-${grupo[j]}`);
    }
  }
});

// Agrupar por coordenada X
const porX: Record<number, string[]> = {};
Object.entries(nodePositions).forEach(([id, pos]) => {
  if (!porX[pos.x]) porX[pos.x] = [];
  porX[pos.x].push(id);
});

Object.values(porX).forEach(grupo => {
  for (let i = 0; i < grupo.length; i++) {
    for (let j = i + 1; j < grupo.length; j++) {
      conexionesSet.add(`${grupo[i]}-${grupo[j]}`);
    }
  }
});

export const conexiones = Array.from(conexionesSet).map(conn => {
  const [desde, hasta] = conn.split('-');
  return { desde, hasta };
});

// Agregar conexiones al grafo
conexiones.forEach(conn => cityGraph.agregarConexion(conn.desde, conn.hasta));

export const getLugaresOptions = () => lugares.map(l => ({ label: l.nombre, value: l.id }));