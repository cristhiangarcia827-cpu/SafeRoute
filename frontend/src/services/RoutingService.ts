import { Place } from '../models/Place';

export interface RouteResult {
  distance: string;
  duration: string;
  polyline: Array<{ latitude: number; longitude: number }>;
  steps: any[];
  dangerScore?: number;
  alternatives?: RouteResult[];
}

export interface Report {
  id: string;
  latitude: number;
  longitude: number;
  lugar: string;
  tipoIncidente: string;
}

class RoutingService {
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private minDistanceToPolyline(
    point: { lat: number; lng: number },
    polyline: Array<{ latitude: number; longitude: number }>
  ): number {
    let minDist = Infinity;
    for (let i = 0; i < polyline.length - 1; i++) {
      const p1 = polyline[i];
      const p2 = polyline[i+1];
      const x1 = p1.longitude, y1 = p1.latitude;
      const x2 = p2.longitude, y2 = p2.latitude;
      const x0 = point.lng, y0 = point.lat;

      const A = x0 - x1, B = y0 - y1;
      const C = x2 - x1, D = y2 - y1;
      const dot = A * C + B * D;
      const len2 = C * C + D * D;
      let t = -1;
      if (len2 > 0) t = dot / len2;

      let closestX, closestY;
      if (t < 0) { closestX = x1; closestY = y1; }
      else if (t > 1) { closestX = x2; closestY = y2; }
      else { closestX = x1 + t * C; closestY = y1 + t * D; }
      const dist = this.haversineDistance(y0, x0, closestY, closestX);
      if (dist < minDist) minDist = dist;
    }
    return minDist;
  }

  private evaluateRoute(route: RouteResult, reports: Report[], dangerRadius = 200): number {
    let totalDanger = 0;
    for (const report of reports) {
      const dist = this.minDistanceToPolyline(
        { lat: report.latitude, lng: report.longitude },
        route.polyline
      );
      if (dist < dangerRadius) {
        totalDanger += (dangerRadius - dist) / dangerRadius;
      }
    }
    return totalDanger;
  }

  async searchPlaces(query: string): Promise<Place[]> {
    if (!query || query.length < 3) return [];
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'SafeRouteApp/1.0 (tu-email@ejemplo.com)' }
      });
      if (!response.ok) return [];
      const data = await response.json();
      if (!Array.isArray(data)) return [];
      return data.map((item: any) => ({
        id: item.place_id.toString(),
        name: item.display_name.split(',')[0],
        address: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  // Ruta simple (sin evaluación de peligro)
  async getRoute(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ): Promise<RouteResult | null> {
    return this.getSafeRoute(originLat, originLng, destLat, destLng, []);
  }

  // Ruta más segura considerando reportes
  async getSafeRoute(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    reports: Report[]
  ): Promise<RouteResult | null> {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson&alternatives=true&steps=false`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.code !== 'Ok') return null;

      const routes = data.routes;
      if (!routes || routes.length === 0) return null;

      const routeResults: RouteResult[] = routes.map((route: any) => {
        const coordinates = route.geometry.coordinates.map((coord: number[]) => ({
          longitude: coord[0],
          latitude: coord[1],
        }));
        return {
          distance: (route.distance / 1000).toFixed(1) + ' km',
          duration: Math.round(route.duration / 60) + ' min',
          polyline: coordinates,
          steps: [],
          dangerScore: 0,
        };
      });

      if (!reports || reports.length === 0) return routeResults[0];

      for (const route of routeResults) {
        route.dangerScore = this.evaluateRoute(route, reports);
      }
      routeResults.sort((a, b) => (a.dangerScore || 0) - (b.dangerScore || 0));
      return routeResults[0];
    } catch (error) {
      console.error('Error getting safe route:', error);
      return null;
    }
  }
}

export default new RoutingService();