import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const MAP_VISIBLE_WIDTH = width - 40;
export const MAP_VISIBLE_HEIGHT = 500;
export const MAP_CONTENT_WIDTH = 800;
export const MAP_CONTENT_HEIGHT = 610;     

export const callesHorizontales = [100, 200, 300, 400, 500, 600, 700];
export const callesVerticales = [80, 160, 240, 320, 400, 480, 560, 640, 720];

export const nodePositions: { [key: string]: { x: number; y: number } } = {
  '1': { x: 80, y: 100 },   // Plaza Norte
  '2': { x: 240, y: 100 },  // Estación Norte
  '3': { x: 400, y: 100 },  // Mirador
  '4': { x: 560, y: 100 },  // Universidad Norte
  '5': { x: 720, y: 100 },  // Parque Norte

  '6': { x: 80, y: 200 },   // Mercado Central
  '7': { x: 240, y: 200 },  // Centro
  '8': { x: 400, y: 200 },  // Catedral
  '9': { x: 560, y: 200 },  // Biblioteca Central
  '10': { x: 720, y: 200 }, // Centro Comercial

  '11': { x: 80, y: 300 },  // Terminal
  '12': { x: 240, y: 300 }, // Plaza Mayor
  '13': { x: 400, y: 300 }, // Hospital
  '14': { x: 560, y: 300 }, // Estadio
  '15': { x: 720, y: 300 }, // Zona Industrial

  '16': { x: 80, y: 400 },  // Barrio Sur
  '17': { x: 240, y: 400 }, // Universidad Sur
  '18': { x: 400, y: 400 }, // Parque Sur
  '19': { x: 560, y: 400 }, // Comisaría
  '20': { x: 720, y: 400 }, // Parque Industrial

  '21': { x: 80, y: 500 },  // Puente Viejo
  '22': { x: 240, y: 500 }, // Mercado Sur
  '23': { x: 400, y: 500 }, // Biblioteca Sur
  '24': { x: 560, y: 500 }, // Centro Cívico
  '25': { x: 720, y: 500 }, // Terminal Sur
};

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