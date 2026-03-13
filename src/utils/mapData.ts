import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const MAP_WIDTH = 500;
export const MAP_HEIGHT = 500;

// Posiciones de los lugares en el mapa (coordenadas x, y)
export const nodePositions: { [key: string]: { x: number; y: number } } = {
  '1': { x: 200, y: 220 }, // Centro
  '2': { x: 80, y: 80 },   // Estación Norte
  '3': { x: 150, y: 180 }, // Parque Central
  '4': { x: 250, y: 280 }, // Mercado Municipal
  '5': { x: 120, y: 300 }, // Universidad
  '6': { x: 300, y: 120 }, // Hospital
  '7': { x: 180, y: 350 }, // Plaza Mayor
  '8': { x: 280, y: 380 }, // Barrio Sur
  '9': { x: 350, y: 250 }, // Zona Industrial
  '10': { x: 220, y: 420 }, // Estadio
  '11': { x: 260, y: 180 }, // Centro Comercial
  '12': { x: 140, y: 250 }, // Biblioteca
  '13': { x: 320, y: 320 }, // Comisaría
  '14': { x: 70, y: 400 },  // Terminal
  '15': { x: 400, y: 350 }, // Parque Industrial
};

// Líneas de la cuadrícula urbana (calles)
export const callesHorizontales = [100, 180, 260, 340, 420];
export const callesVerticales = [80, 160, 240, 320, 400];

export const mapColors = {
  background: '#c0d9e8',
  calle: '#888',
  manzana: '#a0b9c9',
  bordeManzana: '#7f8c8d',
  nodoNormal: '#007AFF',
  nodoOrigen: '#FF9500',
  nodoDestino: '#FF3B30',
  nodoRuta: '#4CAF50',
  lineaRuta: '#4CAF50',
  lineaNormal: '#aaa',
};