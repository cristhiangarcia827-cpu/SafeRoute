import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TabParamList } from '../navigation/types';
import { lugares } from '../utils/routesData';

type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Inicio'>;
type HomeScreenRouteProp = RouteProp<TabParamList, 'Inicio'>;

const { width } = Dimensions.get('window');

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

  // Posiciones fijas para los nodos en el mapa
  const nodePositions: { [key: string]: { x: number; y: number } } = {
    '1': { x: 100, y: 200 }, // Casa
    '2': { x: 200, y: 100 }, // Universidad
    '3': { x: 150, y: 300 }, // Parque
    '4': { x: 300, y: 150 }, // Hospital
    '5': { x: 250, y: 250 }, // Centro Comercial
    '6': { x: 180, y: 400 }, // Biblioteca
    '7': { x: 350, y: 300 }, // Estación de Policía
  };

  const conexiones = [
    { desde: '1', hasta: '2' },
    { desde: '1', hasta: '3' },
    { desde: '2', hasta: '4' },
    { desde: '2', hasta: '5' },
    { desde: '3', hasta: '6' },
    { desde: '4', hasta: '7' },
    { desde: '5', hasta: '6' },
    { desde: '5', hasta: '7' },
    { desde: '6', hasta: '3' },
  ];

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>SafeRoute</Text>
        <Text style={styles.subtitle}>Mapa de conectividad de la ciudad</Text>

        <View style={styles.mapContainer}>
          {/* Líneas de conexión */}
          {conexiones.map((conn, index) => {
            const desdePos = nodePositions[conn.desde];
            const hastaPos = nodePositions[conn.hasta];
            if (!desdePos || !hastaPos) return null;

            const isInRoute = esParteDeRuta(conn.desde, conn.hasta);

            const deltaX = hastaPos.x - desdePos.x;
            const deltaY = hastaPos.y - desdePos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            return (
              <View
                key={`line-${index}`}
                style={[
                  styles.line,
                  {
                    left: desdePos.x,
                    top: desdePos.y,
                    width: distance,
                    transform: [{ rotate: `${angle}deg` }],
                    backgroundColor: isInRoute ? '#4CAF50' : '#ccc',
                  },
                ]}
              />
            );
          })}

          {/* Nodos */}
          {lugares.map((lugar) => {
            const pos = nodePositions[lugar.id];
            if (!pos) return null;
            const isInRoute = rutaActual?.includes(lugar.id);
            const isOrigen = origen === lugar.id;
            const isDestino = destino === lugar.id;

            let backgroundColor = '#007AFF';
            if (isOrigen) backgroundColor = '#FF9500';
            else if (isDestino) backgroundColor = '#FF3B30';
            else if (isInRoute) backgroundColor = '#4CAF50';

            return (
              <View
                key={lugar.id}
                style={[
                  styles.node,
                  {
                    left: pos.x - 20,
                    top: pos.y - 20,
                    backgroundColor,
                  },
                ]}
              >
                <Text style={styles.nodeText}>{lugar.nombre[0]}</Text>
              </View>
            );
          })}
        </View>

        {rutaActual && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeTitle}>Ruta actual:</Text>
            <Text style={styles.routePath}>
              {rutaActual
                .map((id) => lugares.find((l) => l.id === id)?.nombre)
                .join(' → ')}
            </Text>
            <TouchableOpacity onPress={limpiarRuta} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Limpiar ruta</Text>
            </TouchableOpacity>
          </View>
        )}

        {!rutaActual && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Usa la pestaña "Ruta" para buscar caminos seguros entre lugares.
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
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
  },
  mapContainer: {
    width: width - 40,
    height: 450,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#ccc',
    transformOrigin: 'top left',
  },
  node: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  nodeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  routeInfo: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
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
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default HomeScreen;