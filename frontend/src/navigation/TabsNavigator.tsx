import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Pantallas
import HomeScreen from '../screens/HomeScreen';
import RouteScreen from '../screens/RouteScreen';
import ReportScreen from '../screens/ReportScreen';
import AlertListScreen from '../screens/AlertListScreen';

// Tipos
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabsNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          paddingBottom: 4 + insets.bottom,
          paddingTop: 4,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Ruta') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Reportar') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          } else if (route.name === 'Alertas') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen
        name="Ruta"
        component={RouteScreen}
        options={{ title: 'Buscar Ruta' }}
      />
      <Tab.Screen
        name="Reportar"
        component={ReportScreen}
        options={{ title: 'Reportar' }}
      />
      <Tab.Screen
        name="Alertas"
        component={AlertListScreen}
        options={{ title: 'Alertas' }}
      />
    </Tab.Navigator>
  );
}