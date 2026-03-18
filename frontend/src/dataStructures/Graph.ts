export interface Lugar {
  id: string;
  nombre: string;
}

export interface Arista {
  desde: string;
  hasta: string;
}

export class Graph {
  private lugares: Map<string, Lugar>;
  private adyacencias: Map<string, string[]>;

  constructor() {
    this.lugares = new Map();
    this.adyacencias = new Map();
  }

  // Agregar un lugar al grafo
  agregarLugar(id: string, nombre: string): void {
    if (!this.lugares.has(id)) {
      this.lugares.set(id, { id, nombre });
      this.adyacencias.set(id, []);
    }
  }

  // Agregar una conexión entre lugares (bidireccional)
  agregarConexion(desdeId: string, hastaId: string): void {
    if (this.lugares.has(desdeId) && this.lugares.has(hastaId)) {
      const conexionesDesde = this.adyacencias.get(desdeId) || [];
      if (!conexionesDesde.includes(hastaId)) {
        conexionesDesde.push(hastaId);
        this.adyacencias.set(desdeId, conexionesDesde);
      }

      const conexionesHasta = this.adyacencias.get(hastaId) || [];
      if (!conexionesHasta.includes(desdeId)) {
        conexionesHasta.push(desdeId);
        this.adyacencias.set(hastaId, conexionesHasta);
      }
    }
  }

  // Obtener todos los lugares
  obtenerLugares(): Lugar[] {
    return Array.from(this.lugares.values());
  }

  // BFS para encontrar la ruta más corta entre dos lugares
  encontrarRuta(desdeId: string, hastaId: string): string[] | null {
    return this.encontrarRutaConRestricciones(desdeId, hastaId, new Set());
  }

  encontrarRutaEvitando(
    desdeId: string,
    hastaId: string,
    prohibidos: Set<string>
  ): string[] | null {
    return this.encontrarRutaConRestricciones(desdeId, hastaId, prohibidos);
  }

  private encontrarRutaConRestricciones(
    desdeId: string,
    hastaId: string,
    prohibidos: Set<string>
  ): string[] | null {
    if (!this.lugares.has(desdeId) || !this.lugares.has(hastaId)) {
      return null;
    }

    if (prohibidos.has(desdeId) || prohibidos.has(hastaId)) {
      return null;
    }

    const visitados = new Set<string>();
    const cola: { lugar: string; camino: string[] }[] = [];

    visitados.add(desdeId);
    cola.push({ lugar: desdeId, camino: [desdeId] });

    while (cola.length > 0) {
      const actual = cola.shift()!;

      if (actual.lugar === hastaId) {
        return actual.camino;
      }

      const vecinos = this.adyacencias.get(actual.lugar) || [];

      for (const vecino of vecinos) {
        if (!visitados.has(vecino) && !prohibidos.has(vecino)) {
          visitados.add(vecino);
          cola.push({
            lugar: vecino,
            camino: [...actual.camino, vecino],
          });
        }
      }
    }

    return null;
  }

  // Obtener el nombre de un lugar por su ID
  getNombreLugar(id: string): string {
    return this.lugares.get(id)?.nombre || id;
  }
}