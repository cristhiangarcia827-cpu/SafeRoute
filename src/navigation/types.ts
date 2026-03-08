import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: {
    origen?: string;
    destino?: string;
    ruta?: string[];
  } | undefined;
  Route: undefined;
};

export type TabParamList = {
  Inicio: NavigatorScreenParams<HomeStackParamList>;
  Reportar: undefined;
  Alertas: undefined;
};