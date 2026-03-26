import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { TabParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import ReportService from '../services/ReportService';
import ReportCache from '../services/ReportCache';
import { Report } from '../models/Report';

type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Inicio'>;
type HomeScreenRouteProp = RouteProp<TabParamList, 'Inicio'>;

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const mapRef = useRef<MapView>(null);

  const [originCoords, setOriginCoords] = useState(route.params?.originCoords);
  const [destCoords, setDestCoords] = useState(route.params?.destCoords);
  const [routeData, setRouteData] = useState(route.params?.route);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  const loadReports = useCallback(async () => {
    try {
      let cached = ReportCache.getAllReports();
      if (cached.length === 0) {
        await ReportService.getAllReports();
        cached = ReportCache.getAllReports();
      }
      setReports(cached);
    } catch (error) {
      console.error('Error loading reports for map markers:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        Alert.alert(
          'Permiso denegado',
          'No se puede mostrar tu ubicación en el mapa. Puedes seguir usando la app, pero la función de ubicación actual no estará disponible.'
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (route.params?.route) {
      setOriginCoords(route.params.originCoords);
      setDestCoords(route.params.destCoords);
      setRouteData(route.params.route);

      if (route.params.originCoords && route.params.destCoords) {
        const lat = (route.params.originCoords.latitude + route.params.destCoords.latitude) / 2;
        const lng = (route.params.originCoords.longitude + route.params.destCoords.longitude) / 2;
        const latDelta = Math.abs(route.params.originCoords.latitude - route.params.destCoords.latitude) * 1.5;
        const lngDelta = Math.abs(route.params.originCoords.longitude - route.params.destCoords.longitude) * 1.5;

        mapRef.current?.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: Math.max(latDelta, 0.5),
          longitudeDelta: Math.max(lngDelta, 0.5),
        });
      }
    }
  }, [route.params]);

  const limpiarRuta = () => {
    setOriginCoords(undefined);
    setDestCoords(undefined);
    setRouteData(undefined);
    navigation.setParams({ originCoords: undefined, destCoords: undefined, route: undefined });
  };

  const initialRegion: Region = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 40.416775,
        longitude: -3.703790,
        latitudeDelta: 10,
        longitudeDelta: 10,
      };

  if (locationPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Verificando permisos de ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>SafeRoute</Text>
        <Text style={styles.subtitle}>Mapa de rutas seguras</Text>

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={locationPermission === true}
            showsMyLocationButton={locationPermission === true}
            showsCompass={true}
            showsScale={true}
          >
            {/* Marcadores de reportes */}
            {reports.map((report) => {
              if (report.latitude && report.longitude) {
                return (
                  <Marker
                    key={report.id}
                    coordinate={{
                      latitude: report.latitude,
                      longitude: report.longitude,
                    }}
                    title={report.lugar}
                    description={`${report.tipoIncidente} - ${report.descripcion.substring(0, 50)}`}
                    pinColor="red"
                  />
                );
              }
              return null;
            })}
            {originCoords && (
              <Marker
                coordinate={originCoords}
                title="Origen"
                pinColor="green"
              />
            )}
            {destCoords && (
              <Marker
                coordinate={destCoords}
                title="Destino"
                pinColor="red"
              />
            )}
            {routeData && routeData.polyline && (
              <Polyline
                coordinates={routeData.polyline}
                strokeColor="#4CAF50"
                strokeWidth={4}
              />
            )}
          </MapView>
          {!locationPermission && (
            <View style={styles.permissionWarning}>
              <Text style={styles.permissionWarningText}>
                Permiso de ubicación denegado. Actívalo en ajustes para ver tu posición.
              </Text>
            </View>
          )}
        </View>

        {routeData && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeTitle}>🛣️ Ruta segura:</Text>
            <Text style={styles.routePath}>
              Distancia: {routeData.distance} | Duración: {routeData.duration}
            </Text>
            {routeData.dangerScore !== undefined && (
              <Text style={styles.safetyScore}>
                Índice de seguridad: {Math.round((1 - routeData.dangerScore) * 100)}%
              </Text>
            )}
            {routeData.alternativesCount === 1 && (
              <Text style={styles.noAlternativeText}>
                ⚠️ No hay rutas alternativas disponibles. Esta es la única opción.
              </Text>
            )}
            <TouchableOpacity onPress={limpiarRuta} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Limpiar ruta</Text>
            </TouchableOpacity>
          </View>
        )}

        {!routeData && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Ve a la pestaña "Ruta" para encontrar caminos seguros.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  mapContainer: {
    width: width - 40,
    height: 500,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  permissionWarning: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionWarningText: {
    color: '#333',
    fontSize: 12,
  },
  routeInfo: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    width: width - 40,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  routePath: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  safetyScore: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 5,
  },
  noAlternativeText: {
    fontSize: 14,
    color: '#FF9500',
    marginTop: 5,
    fontStyle: 'italic',
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    borderRadius: 8,
    width: width - 40,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;