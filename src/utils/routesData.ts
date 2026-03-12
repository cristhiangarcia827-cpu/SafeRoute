import { Graph } from '../dataStructures/Graph';

export const cityGraph = new Graph();

// Datos de lugares de la ciudad
export const lugares = [
  { id: '1', nombre: 'Casa' },
  { id: '2', nombre: 'Universidad' },
  { id: '3', nombre: 'Parque' },
  { id: '4', nombre: 'Hospital' },
  { id: '5', nombre: 'Centro Comercial' },
  { id: '6', nombre: 'Biblioteca' },
  { id: '7', nombre: 'Estación de Policía' },
];

export const nombreToId: Record<string, string> = {};
lugares.forEach(lugar => {
  nombreToId[lugar.nombre] = lugar.id;
});

// Inicializar lugares en el grafo
lugares.forEach(lugar => {
  cityGraph.agregarLugar(lugar.id, lugar.nombre);
});

const conexiones = [
  { desde: '1', hasta: '2' }, // Casa - Universidad
  { desde: '1', hasta: '3' }, // Casa - Parque
  { desde: '2', hasta: '4' }, // Universidad - Hospital
  { desde: '2', hasta: '5' }, // Universidad - Centro Comercial
  { desde: '3', hasta: '6' }, // Parque - Biblioteca
  { desde: '4', hasta: '7' }, // Hospital - Estación de Policía
  { desde: '5', hasta: '6' }, // Centro Comercial - Biblioteca
  { desde: '5', hasta: '7' }, // Centro Comercial - Estación de Policía
  { desde: '6', hasta: '3' }, // Biblioteca - Parque
];

// Agregar conexiones al grafo
conexiones.forEach(conn => {
  cityGraph.agregarConexion(conn.desde, conn.hasta);
});

// Función auxiliar para obtener lugares
export const getLugaresOptions = () => {
  return lugares.map(lugar => ({
    label: lugar.nombre,
    value: lugar.id
  }));
};