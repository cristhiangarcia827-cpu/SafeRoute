import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Inicio: {
    origen?: string;
    destino?: string;
    ruta?: string[];
  } | undefined;
  Ruta: undefined;          
  Reportar: undefined;
  Alertas: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
};