import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TabParamList } from '../navigation/types';
import { lugares, conexiones } from '../utils/routesData';
import {
  MAP_VISIBLE_WIDTH,
  MAP_VISIBLE_HEIGHT,
  MAP_CONTENT_WIDTH,
  MAP_CONTENT_HEIGHT,
  nodePositions,
  callesHorizontales,
  callesVerticales,
  mapColors,
} from '../utils/mapData';

type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Inicio'>;
type HomeScreenRouteProp = RouteProp<TabParamList, 'Inicio'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();

  const [origen, setOrigen] = useState<string | undefined>(route.params?.origen);
  const [destino, setDestino] = useState<string | undefined>(route.params?.destino);
  const [rutaActual, setRutaActual] = useState<string[] | undefined>(route.params?.ruta);

  useEffect(() => {
    if (route.params?.ruta) {
      setOrigen(route.params.origen);
      setDestino(route.params.destino);
      setRutaActual(route.params.ruta);
    }
  }, [route.params]);

  const esParteDeRuta = (desdeId: string, hastaId: string): boolean => {
    if (!rutaActual) return false;
    for (let i = 0; i < rutaActual.length - 1; i++) {
      if (
        (rutaActual[i] === desdeId && rutaActual[i + 1] === hastaId) ||
        (rutaActual[i] === hastaId && rutaActual[i + 1] === desdeId)
      ) {
        return true;
      }
    }
    return false;
  };

  const limpiarRuta = () => {
    setOrigen(undefined);
    setDestino(undefined);
    setRutaActual(undefined);
    navigation.setParams({ origen: undefined, destino: undefined, ruta: undefined });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>SafeRoute</Text>
        <Text style={styles.subtitle}>Mapa de la ciudad (desliza horizontalmente)</Text>

        {/* Contenedor con ancho fijo viewport que ahora contiene el ScrollView horizontal */}
        <View style={[styles.mapViewport, { width: MAP_VISIBLE_WIDTH, height: MAP_VISIBLE_HEIGHT }]}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{ width: MAP_CONTENT_WIDTH, height: MAP_CONTENT_HEIGHT }}
          >
            <View style={[styles.mapContent, { width: MAP_CONTENT_WIDTH, height: MAP_CONTENT_HEIGHT }]}>
              {/* Fondo de ciudad */}
              <View style={[styles.cityBackground, { backgroundColor: mapColors.background }]}>
                {/* Calles horizontales ahora se dibujan a lo ancho del contenido */}
                {callesHorizontales.map((y, index) => (
                  <View
                    key={`h-${index}`}
                    style={[
                      styles.calleHorizontal,
                      { top: y, width: MAP_CONTENT_WIDTH, backgroundColor: mapColors.calle },
                    ]}
                  />
                ))}
                {/* Calles verticales */}
                {callesVerticales.map((x, index) => (
                  <View
                    key={`v-${index}`}
                    style={[
                      styles.calleVertical,
                      { left: x, height: MAP_CONTENT_HEIGHT, backgroundColor: mapColors.calle },
                    ]}
                  />
                ))}
                {/* Manzanas */}
                {callesHorizontales.slice(0, -1).map((y, i) =>
                  callesVerticales.slice(0, -1).map((x, j) => (
                    <View
                      key={`block-${i}-${j}`}
                      style={[
                        styles.manzana,
                        {
                          left: x + 2,
                          top: y + 2,
                          width: callesVerticales[j + 1] - x - 4,
                          height: callesHorizontales[i + 1] - y - 4,
                          backgroundColor: mapColors.manzana,
                          borderColor: mapColors.bordeManzana,
                        },
                      ]}
                    />
                  ))
                )}
              </View>

              {/* Líneas de conexiones */}
              {conexiones.map((conn, index) => {
                const desde = nodePositions[conn.desde];
                const hasta = nodePositions[conn.hasta];
                if (!desde || !hasta) return null;

                const isInRoute = esParteDeRuta(conn.desde, conn.hasta);
                const deltaX = hasta.x - desde.x;
                const deltaY = hasta.y - desde.y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

                return (
                  <View
                    key={`conn-${index}`}
                    style={[
                      styles.line,
                      {
                        left: desde.x,
                        top: desde.y,
                        width: distance,
                        transform: [{ rotate: `${angle}deg` }],
                        backgroundColor: isInRoute ? mapColors.lineaRuta : mapColors.lineaNormal,
                        opacity: isInRoute ? 1 : 0.4,
                        height: isInRoute ? 4 : 2,
                      },
                    ]}
                  />
                );
              })}

              {/* Marcadores de lugares */}
              {lugares.map((lugar) => {
                const pos = nodePositions[lugar.id];
                if (!pos) return null;
                const isInRoute = rutaActual?.includes(lugar.id);
                const isOrigen = origen === lugar.id;
                const isDestino = destino === lugar.id;

                let backgroundColor = mapColors.nodoNormal;
                if (isOrigen) backgroundColor = mapColors.nodoOrigen;
                else if (isDestino) backgroundColor = mapColors.nodoDestino;
                else if (isInRoute) backgroundColor = mapColors.nodoRuta;

                return (
                  <View
                    key={lugar.id}
                    style={[
                      styles.marker,
                      {
                        left: pos.x - 15,
                        top: pos.y - 15,
                      },
                    ]}
                  >
                    <View style={[styles.markerDot, { backgroundColor }]} />
                    <Text style={styles.markerLabel}>{lugar.nombre}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {rutaActual && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeTitle}>🛣️ Ruta segura:</Text>
            <Text style={styles.routePath}>
              {rutaActual.map((id) => lugares.find((l) => l.id === id)?.nombre).join(' → ')}
            </Text>
            <TouchableOpacity onPress={limpiarRuta} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Limpiar ruta</Text>
            </TouchableOpacity>
          </View>
        )}

        {!rutaActual && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Ve a la pestaña "Ruta" para encontrar caminos seguros evitando zonas peligrosas.
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
  mapViewport: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapContent: {
    position: 'relative',
    backgroundColor: '#e0e0e0',
  },
  cityBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  calleHorizontal: {
    position: 'absolute',
    height: 4,
    left: 0,
  },
  calleVertical: {
    position: 'absolute',
    width: 4,
    top: 0,
  },
  manzana: {
    position: 'absolute',
    borderWidth: 1,
  },
  line: {
    position: 'absolute',
    transformOrigin: 'top left',
    zIndex: 5,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  markerLabel: {
    fontSize: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    color: '#333',
    fontWeight: '600',
  },
  routeInfo: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    width: MAP_VISIBLE_WIDTH,
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
    marginBottom: 10,
  },
  clearButton: {
    alignSelf: 'flex-end',
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
    width: MAP_VISIBLE_WIDTH,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;