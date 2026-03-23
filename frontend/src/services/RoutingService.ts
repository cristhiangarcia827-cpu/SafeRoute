import { Place } from '../models/Place';

export interface RouteResult {
  distance: string;
  duration: string;
  polyline: Array<{ latitude: number; longitude: number }>;
  steps: any[];
}

class RoutingService {
  private lastRequestTime = 0;
  private pendingRequest: NodeJS.Timeout | null = null;

  // Buscar lugares con OpenStreetMap Nominatim
  async searchPlaces(query: string): Promise<Place[]> {
    if (!query || query.length < 3) return [];
    return new Promise((resolve) => {
      if (this.pendingRequest) clearTimeout(this.pendingRequest);
      this.pendingRequest = setTimeout(async () => {
        const now = Date.now();
        const timeSinceLast = now - this.lastRequestTime;

        if (timeSinceLast < 1000) {
          await new Promise(r => setTimeout(r, 1000 - timeSinceLast));
        }

        this.lastRequestTime = Date.now();
        const results = await this.doSearch(query);
        resolve(results);
      }, 500);
    });
  }

  private async doSearch(query: string): Promise<Place[]> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=5`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SafeRouteApp/1.0', 
        },
      });

      if (response.status === 429) {
        console.warn('Nominatim rate limit. Waiting 2 seconds...');
        await new Promise(r => setTimeout(r, 2000));
        return this.doSearch(query);
      }

      if (!response.ok) {
        console.error(`Nominatim error: ${response.status} ${response.statusText}`);
        return [];
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Error parsing Nominatim response:', text.substring(0, 200));
        return [];
      }

      if (!Array.isArray(data)) return [];

      return data.map((item: any) => ({
        id: item.place_id.toString(),
        name: item.display_name.split(',')[0],
        address: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));
    } catch (error) {
      console.error('Error searching places with OSM:', error);
      return [];
    }
  }

  // Obtener ruta usando OSRM (Open Source Routing Machine)
  async getRoute(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ): Promise<RouteResult | null> {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`OSRM error: ${response.status}`);
        return null;
      }

      const data = await response.json();

      if (data.code !== 'Ok') {
        console.error('OSRM error:', data);
        return null;
      }

      const route = data.routes[0];
      const coordinates = route.geometry.coordinates.map((coord: number[]) => ({
        longitude: coord[0],
        latitude: coord[1],
      }));

      return {
        distance: (route.distance / 1000).toFixed(1) + ' km',
        duration: Math.round(route.duration / 60) + ' min',
        polyline: coordinates,
        steps: [],
      };
    } catch (error) {
      console.error('Error getting route from OSRM:', error);
      return null;
    }
  }
}

export default new RoutingService();