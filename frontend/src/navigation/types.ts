import { NavigatorScreenParams } from '@react-navigation/native';
import { RouteResult } from '../services/RoutingService';

export type TabParamList = {
  Inicio: {
    originCoords?: { latitude: number; longitude: number };
    destCoords?: { latitude: number; longitude: number };
    route?: RouteResult;
  } | undefined;
  Ruta: undefined;
  Reportar: undefined;
  Alertas: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
};