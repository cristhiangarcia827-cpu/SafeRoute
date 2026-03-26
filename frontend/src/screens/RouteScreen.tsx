import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TabParamList } from '../navigation/types';
import CustomButton from '../components/CustomButton';
import PlaceAutocomplete from '../components/PlaceAutocomplete';
import RoutingService from '../services/RoutingService';
import ReportService from '../services/ReportService';
import { Place } from '../models/Place';

type RouteScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Ruta'>;

const RouteScreen: React.FC = () => {
  const navigation = useNavigation<RouteScreenNavigationProp>();

  const [origen, setOrigen] = useState<Place | null>(null);
  const [destino, setDestino] = useState<Place | null>(null);
  const [mensajeError, setMensajeError] = useState('');
  const [loading, setLoading] = useState(false);

  const buscarRuta = async () => {
    if (!origen || !destino) {
      setMensajeError('Selecciona origen y destino');
      return;
    }

    setLoading(true);
    setMensajeError('');
    try {
      const reports = await ReportService.getAllReports();
      const validReports = reports
        .filter(r => r.latitude && r.longitude)
        .map(r => ({
          id: r.id,
          latitude: r.latitude!,
          longitude: r.longitude!,
          lugar: r.lugar,
          tipoIncidente: r.tipoIncidente,
        }));

      const route = await RoutingService.getSafeRoute(
        origen.latitude,
        origen.longitude,
        destino.latitude,
        destino.longitude,
        validReports
      );

      if (route) {
        navigation.navigate('Inicio', {
          originCoords: { latitude: origen.latitude, longitude: origen.longitude },
          destCoords: { latitude: destino.latitude, longitude: destino.longitude },
          route,
        });
      } else {
        setMensajeError('No se pudo calcular la ruta. Intenta de nuevo.');
      }
    } catch (error) {
      console.error(error);
      setMensajeError('Error al obtener reportes o calcular ruta');
    } finally {
      setLoading(false);
    }
  };

  const resetSelection = () => {
    setOrigen(null);
    setDestino(null);
    setMensajeError('');
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Buscar Ruta Segura</Text>
      <Text style={styles.subtitle}>Selecciona origen y destino</Text>

      <View style={styles.selectContainer}>
        <Text style={styles.label}>Origen:</Text>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>
            {origen ? origen.name : 'Seleccionar origen'}
          </Text>
        </TouchableOpacity>
        <PlaceAutocomplete
          onPlaceSelected={setOrigen}
          placeholder="Buscar origen..."
        />
      </View>

      <View style={styles.selectContainer}>
        <Text style={styles.label}>Destino:</Text>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>
            {destino ? destino.name : 'Seleccionar destino'}
          </Text>
        </TouchableOpacity>
        <PlaceAutocomplete
          onPlaceSelected={setDestino}
          placeholder="Buscar destino..."
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title={loading ? "Buscando ruta segura..." : "Buscar Ruta Segura"}
          onPress={buscarRuta}
          variant="primary"
          style={styles.button}
          disabled={loading}
        />
        <CustomButton
          title="Reiniciar"
          onPress={resetSelection}
          variant="secondary"
          style={styles.button}
          disabled={loading}
        />
      </View>

      {mensajeError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{mensajeError}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      data={[]}
      keyExtractor={() => 'header'}
      renderItem={null}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={true}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 30,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 30,
    textAlign: 'center',
  },
  selectContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  selectButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  exampleButton: {
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default RouteScreen;