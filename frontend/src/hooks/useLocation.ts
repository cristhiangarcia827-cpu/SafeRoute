import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  errorMsg: string | null;
  loading: boolean;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    errorMsg: null,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation({
          latitude: null,
          longitude: null,
          errorMsg: 'Permiso de ubicación denegado',
          loading: false,
        });
        return;
      }

      try {
        const locationData = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
          errorMsg: null,
          loading: false,
        });
      } catch (error) {
        setLocation({
          latitude: null,
          longitude: null,
          errorMsg: 'Error al obtener ubicación',
          loading: false,
        });
      }
    })();
  }, []);

  return location;
};