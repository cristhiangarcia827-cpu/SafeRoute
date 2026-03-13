import { Graph } from '../dataStructures/Graph';

export const cityGraph = new Graph();

// Datos de lugares de la ciudad
export const lugares = [
  { id: '1', nombre: 'Centro' },
  { id: '2', nombre: 'Estación Norte' },
  { id: '3', nombre: 'Parque Central' },
  { id: '4', nombre: 'Mercado Municipal' },
  { id: '5', nombre: 'Universidad' },
  { id: '6', nombre: 'Hospital' },
  { id: '7', nombre: 'Plaza Mayor' },
  { id: '8', nombre: 'Barrio Sur' },
  { id: '9', nombre: 'Zona Industrial' },
  { id: '10', nombre: 'Estadio' },
  { id: '11', nombre: 'Centro Comercial' },
  { id: '12', nombre: 'Biblioteca' },
  { id: '13', nombre: 'Comisaría' },
  { id: '14', nombre: 'Terminal' },
  { id: '15', nombre: 'Parque Industrial' },
];

export const nombreToId: Record<string, string> = {};
lugares.forEach(lugar => {
  nombreToId[lugar.nombre] = lugar.id;
});

lugares.forEach(lugar => {
  cityGraph.agregarLugar(lugar.id, lugar.nombre);
});

// Conexiones que forman una cuadrícula simulando calles
export const conexiones = [
  // Centro conecta con varios
  { desde: '1', hasta: '3' }, // Centro - Parque Central
  { desde: '1', hasta: '4' }, // Centro - Mercado
  { desde: '1', hasta: '7' }, // Centro - Plaza Mayor
  { desde: '1', hasta: '11' }, // Centro - Centro Comercial

  // Estación Norte
  { desde: '2', hasta: '3' }, // Estación Norte - Parque Central
  { desde: '2', hasta: '5' }, // Estación Norte - Universidad
  { desde: '2', hasta: '14' }, // Estación Norte - Terminal

  // Parque Central
  { desde: '3', hasta: '4' }, // Parque Central - Mercado
  { desde: '3', hasta: '7' }, // Parque Central - Plaza Mayor
  { desde: '3', hasta: '12' }, // Parque Central - Biblioteca

  // Mercado
  { desde: '4', hasta: '8' }, // Mercado - Barrio Sur
  { desde: '4', hasta: '11' }, // Mercado - Centro Comercial

  // Universidad
  { desde: '5', hasta: '6' }, // Universidad - Hospital
  { desde: '5', hasta: '12' }, // Universidad - Biblioteca

  // Hospital
  { desde: '6', hasta: '9' }, // Hospital - Zona Industrial
  { desde: '6', hasta: '13' }, // Hospital - Comisaría

  // Plaza Mayor
  { desde: '7', hasta: '8' }, // Plaza Mayor - Barrio Sur
  { desde: '7', hasta: '10' }, // Plaza Mayor - Estadio

  // Barrio Sur
  { desde: '8', hasta: '9' }, // Barrio Sur - Zona Industrial
  { desde: '8', hasta: '10' }, // Barrio Sur - Estadio

  // Zona Industrial
  { desde: '9', hasta: '15' }, // Zona Industrial - Parque Industrial

  // Estadio
  { desde: '10', hasta: '11' }, // Estadio - Centro Comercial
  { desde: '10', hasta: '13' }, // Estadio - Comisaría

  // Centro Comercial
  { desde: '11', hasta: '12' }, // Centro Comercial - Biblioteca
  { desde: '11', hasta: '13' }, // Centro Comercial - Comisaría

  // Biblioteca
  { desde: '12', hasta: '13' }, // Biblioteca - Comisaría

  // Comisaría
  { desde: '13', hasta: '14' }, // Comisaría - Terminal

  // Terminal
  { desde: '14', hasta: '15' }, // Terminal - Parque Industrial
];

conexiones.forEach(conn => {
  cityGraph.agregarConexion(conn.desde, conn.hasta);
});

export const getLugaresOptions = () => {
  return lugares.map(lugar => ({
    label: lugar.nombre,
    value: lugar.id,
  }));
};