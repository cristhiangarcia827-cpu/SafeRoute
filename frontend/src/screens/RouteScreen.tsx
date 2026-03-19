import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TabParamList } from '../navigation/types';
import CustomButton from '../components/CustomButton';
import GoogleMapsService from '../services/GoogleMapsService';
import { Place } from '../models/Place';
import ReportService from '../services/ReportService';
import { nombreToId } from '../utils/routesData'; // para evitar zonas peligrosas (aún usando IDs)

type RouteScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Ruta'>;

const RouteScreen: React.FC = () => {
  const navigation = useNavigation<RouteScreenNavigationProp>();

  const [origen, setOrigen] = useState<Place | null>(null);
  const [destino, setDestino] = useState<Place | null>(null);
  const [origenModal, setOrigenModal] = useState(false);
  const [destinoModal, setDestinoModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  // Buscar lugares cuando cambia el texto
  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.length < 3) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    const results = await GoogleMapsService.searchPlaces(text);
    setSearchResults(results);
    setLoading(false);
  };

  const seleccionarLugar = (place: Place) => {
    if (origenModal) {
      setOrigen(place);
      setOrigenModal(false);
    } else if (destinoModal) {
      setDestino(place);
      setDestinoModal(false);
    }
    setSearchText('');
    setSearchResults([]);
  };

  const buscarRuta = async () => {
    if (!origen || !destino) {
      setMensajeError('Selecciona origen y destino');
      return;
    }

    // Aquí deberías implementar la lógica de evitar zonas peligrosas
    // usando ReportService y comparando coordenadas.
    // Por simplicidad, ahora mismo obtenemos la ruta directamente.
    const route = await GoogleMapsService.getRoute(
      origen.latitude,
      origen.longitude,
      destino.latitude,
      destino.longitude
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
  };

  const resetSelection = () => {
    setOrigen(null);
    setDestino(null);
    setMensajeError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buscar Ruta Segura</Text>
      <Text style={styles.subtitle}>Selecciona origen y destino</Text>

      <View style={styles.selectContainer}>
        <Text style={styles.label}>Origen:</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            setOrigenModal(true);
            setDestinoModal(false);
            setSearchText('');
            setSearchResults([]);
          }}
        >
          <Text style={styles.selectButtonText}>
            {origen ? origen.name : 'Seleccionar origen'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selectContainer}>
        <Text style={styles.label}>Destino:</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            setDestinoModal(true);
            setOrigenModal(false);
            setSearchText('');
            setSearchResults([]);
          }}
        >
          <Text style={styles.selectButtonText}>
            {destino ? destino.name : 'Seleccionar destino'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de búsqueda */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={origenModal || destinoModal}
        onRequestClose={() => {
          setOrigenModal(false);
          setDestinoModal(false);
          setSearchText('');
          setSearchResults([]);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Buscar {origenModal ? 'origen' : 'destino'}
            </Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Escribe el nombre del lugar..."
              value={searchText}
              onChangeText={handleSearch}
              autoFocus={true}
            />
            {loading && <Text style={styles.loadingText}>Buscando...</Text>}
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => seleccionarLugar(item)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  <Text style={styles.modalItemAddress}>{item.address}</Text>
                </TouchableOpacity>
              )}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                searchText.length >= 3 && !loading ? (
                  <Text style={styles.emptyText}>No se encontraron lugares</Text>
                ) : null
              }
            />
            <CustomButton
              title="Cancelar"
              onPress={() => {
                setOrigenModal(false);
                setDestinoModal(false);
                setSearchText('');
                setSearchResults([]);
              }}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Buscar Ruta Segura"
          onPress={buscarRuta}
          variant="primary"
          style={styles.button}
        />
        <CustomButton
          title="Reiniciar"
          onPress={resetSelection}
          variant="secondary"
          style={styles.button}
        />
      </View>

      {mensajeError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{mensajeError}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingText: {
    textAlign: 'center',
    padding: 10,
    color: '#666',
  },
  list: {
    maxHeight: 400,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalItemAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
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