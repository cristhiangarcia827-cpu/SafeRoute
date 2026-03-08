import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Pantallas
import HomeScreen from '../screens/HomeScreen';
import RouteScreen from '../screens/RouteScreen';
import ReportScreen from '../screens/ReportScreen';
import AlertListScreen from '../screens/AlertListScreen';

// Tipos
import { HomeStackParamList, TabParamList } from './types';

const HomeStack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <HomeStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'SafeRoute' }}
      />
      <HomeStack.Screen 
        name="Route" 
        component={RouteScreen} 
        options={{ title: 'Buscar Ruta Segura' }}
      />
    </HomeStack.Navigator>
  );
};

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
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
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
        component={HomeStackNavigator} 
        options={{ title: 'Inicio' }}
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