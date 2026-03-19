import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../navigation/types';
import CustomButton from '../components/CustomButton';
import ReportService from '../services/ReportService';
import { IncidenteType } from '../models/Report';
import GoogleMapsService from '../services/GoogleMapsService';
import { Place } from '../models/Place';

type ReportScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Reportar'>;

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<ReportScreenNavigationProp>();

  const [lugar, setLugar] = useState<Place | null>(null);
  const [tipoIncidente, setTipoIncidente] = useState<IncidenteType | string>('Robo');
  const [descripcion, setDescripcion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [lugarModalVisible, setLugarModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [otroTexto, setOtroTexto] = useState('');

  const incidentes: (IncidenteType | 'Otro')[] = ['Robo', 'Asalto', 'Acoso', 'Zona Oscura', 'Otro'];

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

  const handleSubmit = async () => {
    if (!lugar) {
      Alert.alert('Error', 'Selecciona un lugar');
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert('Error', 'Escribe una descripción');
      return;
    }

    const tipoFinal = tipoIncidente === 'Otro' ? otroTexto.trim() : tipoIncidente;
    if (tipoIncidente === 'Otro' && !tipoFinal) {
      Alert.alert('Error', 'Especifica el tipo de incidente');
      return;
    }

    const newReport = {
      lugar: lugar.name,
      tipoIncidente: tipoFinal,
      descripcion: descripcion.trim(),
      fecha: new Date().toLocaleDateString(),
      latitude: lugar.latitude,
      longitude: lugar.longitude,
    };

    try {
      await ReportService.addReport(newReport as any);
      Alert.alert(
        'Éxito',
        'Reporte guardado correctamente',
        [
          {
            text: 'Ver reportes',
            onPress: () => navigation.navigate('Alertas'),
          },
          {
            text: 'Nuevo reporte',
            onPress: () => {
              setLugar(null);
              setTipoIncidente('Robo');
              setDescripcion('');
              setOtroTexto('');
            },
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el reporte');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Lugar del incidente *</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          setLugarModalVisible(true);
          setSearchText('');
          setSearchResults([]);
        }}
      >
        <Text style={styles.selectButtonText}>
          {lugar ? lugar.name : 'Seleccionar lugar'}
        </Text>
      </TouchableOpacity>

      {/* Modal para seleccionar lugar con buscador */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={lugarModalVisible}
        onRequestClose={() => {
          setLugarModalVisible(false);
          setSearchText('');
          setSearchResults([]);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buscar lugar</Text>
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
                  onPress={() => {
                    setLugar(item);
                    setLugarModalVisible(false);
                    setSearchText('');
                    setSearchResults([]);
                  }}
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
                setLugarModalVisible(false);
                setSearchText('');
                setSearchResults([]);
              }}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Tipo de incidente *</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>
          {tipoIncidente === 'Otro' && otroTexto ? otroTexto : tipoIncidente}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona el tipo de incidente</Text>
            {incidentes.map((incidente) => (
              <TouchableOpacity
                key={incidente}
                style={styles.modalItem}
                onPress={() => {
                  setTipoIncidente(incidente);
                  setModalVisible(false);
                  if (incidente !== 'Otro') {
                    setOtroTexto('');
                  }
                }}
              >
                <Text style={styles.modalItemText}>{incidente}</Text>
              </TouchableOpacity>
            ))}
            <CustomButton
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>

      {tipoIncidente === 'Otro' && (
        <View style={styles.otroContainer}>
          <Text style={styles.label}>Especifica el tipo *</Text>
          <TextInput
            style={styles.input}
            value={otroTexto}
            onChangeText={setOtroTexto}
            placeholder="Ej: Vandalismo, Riña, etc."
          />
        </View>
      )}

      <Text style={styles.label}>Descripción *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Describe lo sucedido..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <CustomButton
        title="Guardar Reporte"
        onPress={handleSubmit}
        variant="primary"
        style={styles.button}
      />

      <CustomButton
        title="Cancelar"
        onPress={() => navigation.goBack()}
        variant="secondary"
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
  },
  button: {
    marginVertical: 10,
  },
  selectButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
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
  otroContainer: {
    marginBottom: 20,
  },
});

export default ReportScreen;