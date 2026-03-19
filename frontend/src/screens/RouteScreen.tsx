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
import { cityGraph, getLugaresOptions, lugares, nombreToId } from '../utils/routesData';
import ReportService from '../services/ReportService';  // Nuevo servicio

type RouteScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Ruta'>;

const RouteScreen: React.FC = () => {
  const navigation = useNavigation<RouteScreenNavigationProp>();

  const [origen, setOrigen] = useState<string>('');
  const [destino, setDestino] = useState<string>('');
  const [origenModal, setOrigenModal] = useState(false);
  const [destinoModal, setDestinoModal] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const lugaresOptions = getLugaresOptions();
  const filteredOptions = lugaresOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const buscarRuta = async () => {
    if (!origen || !destino) {
      setMensajeError('Selecciona origen y destino');
      return;
    }

    if (origen === destino) {
      setMensajeError('El origen y destino no pueden ser el mismo');
      return;
    }

    setLoading(true);
    try {
      // Obtener reportes desde Firestore
      const reports = await ReportService.getAllReports();
      
      const lugaresConReportes = reports.map(r => r.lugar);
      const idsProhibidos = new Set<string>();
      lugaresConReportes.forEach(nombre => {
        const id = nombreToId[nombre];
        if (id) idsProhibidos.add(id);
      });
      
      // No prohibir origen y destino
      idsProhibidos.delete(origen);
      idsProhibidos.delete(destino);

      const ruta = cityGraph.encontrarRutaEvitando(origen, destino, idsProhibidos);

      if (ruta) {
        navigation.navigate('Inicio', { origen, destino, ruta });
      } else {
        setMensajeError('No se encontró una ruta segura. Intenta con otro origen/destino o reporta menos zonas.');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al consultar zonas peligrosas');
    } finally {
      setLoading(false);
    }
  };

  const resetSelection = () => {
    setOrigen('');
    setDestino('');
    setMensajeError('');
  };

  const handleSelect = (value: string) => {
    if (origenModal) {
      setOrigen(value);
      setOrigenModal(false);
    } else if (destinoModal) {
      setDestino(value);
      setDestinoModal(false);
    }
    setSearchText('');
  };

  const renderLugarItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleSelect(item.value)}
    >
      <Text style={styles.modalItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const getNombreLugar = (id: string) => {
    return lugares.find((l) => l.id === id)?.nombre || id;
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
          }}
        >
          <Text style={styles.selectButtonText}>
            {origen ? getNombreLugar(origen) : 'Seleccionar origen'}
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
          }}
        >
          <Text style={styles.selectButtonText}>
            {destino ? getNombreLugar(destino) : 'Seleccionar destino'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal con buscador */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={origenModal || destinoModal}
        onRequestClose={() => {
          setOrigenModal(false);
          setDestinoModal(false);
          setSearchText('');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Seleccionar {origenModal ? 'origen' : 'destino'}
            </Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar lugar..."
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
            />

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={renderLugarItem}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.emptyText}>No se encontraron lugares</Text>
              }
            />

            <CustomButton
              title="Cancelar"
              onPress={() => {
                setOrigenModal(false);
                setDestinoModal(false);
                setSearchText('');
              }}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <CustomButton
          title={loading ? "Buscando..." : "Buscar Ruta Segura"}
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

      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Lugares disponibles:</Text>
        {lugares.map((lugar) => (
          <View key={lugar.id} style={styles.lugarInfo}>
            <Text style={styles.lugarName}>📍 {lugar.nombre}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Estilos (iguales que antes)
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
    width: '80%',
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
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  list: {
    maxHeight: 300,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
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
  graphContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  lugarInfo: {
    marginBottom: 8,
  },
  lugarName: {
    fontSize: 14,
    color: '#007AFF',
  },
});

export default RouteScreen;