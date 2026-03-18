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
import { commonStyles, homeStyles } from '../styles/screenStyles';

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
    <View style={commonStyles.container}>
      <ScrollView 
        contentContainerStyle={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={commonStyles.title}>SafeRoute</Text>
        <Text style={commonStyles.subtitle}>Mapa de la ciudad (desliza en ambas direcciones)</Text>

        <View style={[homeStyles.mapViewport, { width: MAP_VISIBLE_WIDTH, height: MAP_VISIBLE_HEIGHT }]}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              contentContainerStyle={{ width: MAP_CONTENT_WIDTH, height: MAP_CONTENT_HEIGHT }}
            >
              <View style={[homeStyles.mapContent, { width: MAP_CONTENT_WIDTH, height: MAP_CONTENT_HEIGHT }]}>
                <View style={[homeStyles.cityBackground, { backgroundColor: mapColors.background }]}>
                  {callesHorizontales.map((y, index) => (
                    <View
                      key={`h-${index}`}
                      style={[
                        homeStyles.calleHorizontal,
                        { top: y, width: MAP_CONTENT_WIDTH, backgroundColor: mapColors.calle },
                      ]}
                    />
                  ))}
                  {callesVerticales.map((x, index) => (
                    <View
                      key={`v-${index}`}
                      style={[
                        homeStyles.calleVertical,
                        { left: x, height: MAP_CONTENT_HEIGHT, backgroundColor: mapColors.calle },
                      ]}
                    />
                  ))}
                  {callesHorizontales.slice(0, -1).map((y, i) =>
                    callesVerticales.slice(0, -1).map((x, j) => (
                      <View
                        key={`block-${i}-${j}`}
                        style={[
                          homeStyles.manzana,
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

                {conexiones.map((conn) => {
                  const desde = nodePositions[conn.desde];
                  const hasta = nodePositions[conn.hasta];
                  if (!desde || !hasta) return null;

                  const isInRoute = esParteDeRuta(conn.desde, conn.hasta);
                  const color = isInRoute ? mapColors.lineaRuta : mapColors.lineaNormal;
                  const opacity = isInRoute ? 1 : 0.4;
                  const thickness = isInRoute ? 4 : 2;

                  const baseKey = `conn-${conn.desde}-${conn.hasta}`;

                  if (desde.y === hasta.y) {
                    const x1 = Math.min(desde.x, hasta.x);
                    const x2 = Math.max(desde.x, hasta.x);
                    return (
                      <View
                        key={baseKey}
                        style={[
                          homeStyles.line,
                          {
                            left: x1,
                            top: desde.y,
                            width: x2 - x1,
                            height: thickness,
                            backgroundColor: color,
                            opacity,
                          },
                        ]}
                      />
                    );
                  }

                  if (desde.x === hasta.x) {
                    const y1 = Math.min(desde.y, hasta.y);
                    const y2 = Math.max(desde.y, hasta.y);
                    return (
                      <View
                        key={baseKey}
                        style={[
                          homeStyles.line,
                          {
                            left: desde.x,
                            top: y1,
                            width: y2 - y1,
                            height: thickness,
                            backgroundColor: color,
                            opacity,
                            transform: [{ rotate: '90deg' }],
                          },
                        ]}
                      />
                    );
                  }

                  const intermedioX = hasta.x;
                  const intermedioY = desde.y;

                  const xHorIzq = Math.min(desde.x, intermedioX);
                  const xHorDer = Math.max(desde.x, intermedioX);
                  const anchoHor = xHorDer - xHorIzq;

                  const yVerSup = Math.min(intermedioY, hasta.y);
                  const yVerInf = Math.max(intermedioY, hasta.y);
                  const altoVer = yVerInf - yVerSup;

                  return (
                    <React.Fragment key={baseKey}>
                      <View
                        style={[
                          homeStyles.line,
                          {
                            left: xHorIzq,
                            top: intermedioY,
                            width: anchoHor,
                            height: thickness,
                            backgroundColor: color,
                            opacity,
                          },
                        ]}
                      />
                      <View
                        style={[
                          homeStyles.line,
                          {
                            left: intermedioX,
                            top: yVerSup,
                            width: altoVer,
                            height: thickness,
                            backgroundColor: color,
                            opacity,
                            transform: [{ rotate: '90deg' }],
                          },
                        ]}
                      />
                    </React.Fragment>
                  );
                })}

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
                        homeStyles.marker,
                        {
                          left: pos.x - 15,
                          top: pos.y - 15,
                        },
                      ]}
                    >
                      <View style={[homeStyles.markerDot, { backgroundColor }]} />
                      <Text style={homeStyles.markerLabel}>{lugar.nombre}</Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </ScrollView>
        </View>

        {rutaActual && (
          <View style={homeStyles.routeInfo}>
            <Text style={homeStyles.routeTitle}>🛣️ Ruta segura:</Text>
            <Text style={homeStyles.routePath}>
              {rutaActual.map((id) => lugares.find((l) => l.id === id)?.nombre).join(' → ')}
            </Text>
            <TouchableOpacity onPress={limpiarRuta} style={homeStyles.clearButton}>
              <Text style={homeStyles.clearButtonText}>Limpiar ruta</Text>
            </TouchableOpacity>
          </View>
        )}

        {!rutaActual && (
          <View style={commonStyles.infoContainer}>
            <Text style={commonStyles.infoText}>
              Ve a la pestaña "Ruta" para encontrar caminos seguros evitando zonas peligrosas.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;