import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/types';
import CustomButton from '../components/CustomButton';
import { cityGraph, getLugaresOptions, lugares } from '../utils/routesData';

type RouteScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Route'>;

const RouteScreen: React.FC = () => {
  const navigation = useNavigation<RouteScreenNavigationProp>();

  const [origen, setOrigen] = useState<string>('');
  const [destino, setDestino] = useState<string>('');
  const [origenModal, setOrigenModal] = useState(false);
  const [destinoModal, setDestinoModal] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const lugaresOptions = getLugaresOptions();

  const buscarRuta = () => {
    if (!origen || !destino) {
      setMensajeError('Selecciona origen y destino');
      return;
    }

    if (origen === destino) {
      setMensajeError('El origen y destino no pueden ser el mismo');
      return;
    }

    const ruta = cityGraph.encontrarRuta(origen, destino);

    if (ruta) {
      // Navegar de regreso a Home pasando los datos de la ruta
      navigation.navigate('Home', {
        origen,
        destino,
        ruta,
      });
    } else {
      setMensajeError('No se encontró una ruta entre estos lugares');
    }
  };

  const resetSelection = () => {
    setOrigen('');
    setDestino('');
    setMensajeError('');
  };

  const renderLugarItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        if (origenModal) {
          setOrigen(item.value);
          setOrigenModal(false);
        } else if (destinoModal) {
          setDestino(item.value);
          setDestinoModal(false);
        }
      }}
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
          }}
        >
          <Text style={styles.selectButtonText}>
            {destino ? getNombreLugar(destino) : 'Seleccionar destino'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal para seleccionar lugar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={origenModal || destinoModal}
        onRequestClose={() => {
          setOrigenModal(false);
          setDestinoModal(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Seleccionar {origenModal ? 'origen' : 'destino'}
            </Text>
            <FlatList
              data={lugaresOptions}
              keyExtractor={(item) => item.value}
              renderItem={renderLugarItem}
            />
            <CustomButton
              title="Cancelar"
              onPress={() => {
                setOrigenModal(false);
                setDestinoModal(false);
              }}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Buscar Ruta"
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
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
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