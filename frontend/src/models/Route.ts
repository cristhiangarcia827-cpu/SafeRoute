export interface Place {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  latitude?: number;
  longitude?: number;
}

export interface Route {
  path: { lat: number; lng: number }[];
  distance: string;
  duration: string;
  polyline: string;
}