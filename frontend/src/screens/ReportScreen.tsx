import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../navigation/types';
import CustomButton from '../components/CustomButton';
import PlaceAutocomplete from '../components/PlaceAutocomplete';
import ReportService from '../services/ReportService';
import { IncidenteType, NewReport } from '../models/Report';
import { Place } from '../models/Place';

type ReportScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Reportar'>;

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<ReportScreenNavigationProp>();

  const [lugar, setLugar] = useState<Place | null>(null);
  const [tipoIncidente, setTipoIncidente] = useState<IncidenteType | string>('Robo');
  const [descripcion, setDescripcion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [otroTexto, setOtroTexto] = useState('');

  const incidentes: (IncidenteType | 'Otro')[] = ['Robo', 'Asalto', 'Acoso', 'Zona Oscura', 'Otro'];

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

    const newReport: NewReport = {
      lugar: lugar.name,
      tipoIncidente: tipoFinal,
      descripcion: descripcion.trim(),
      fecha: new Date(),
      latitude: lugar.latitude,
      longitude: lugar.longitude,
    };

    try {
      await ReportService.addReport(newReport);
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
    } catch (error: any) {
      console.error('Error al guardar reporte:', error);
      Alert.alert('Error', `No se pudo guardar el reporte: ${error.message}`);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Lugar del incidente *</Text>
      <PlaceAutocomplete
        onPlaceSelected={setLugar}
        placeholder="Buscar lugar..."
      />
      {lugar && <Text style={styles.selectedPlace}>Lugar seleccionado: {lugar.name}</Text>}

      <Text style={styles.label}>Tipo de incidente *</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>
          {tipoIncidente === 'Otro' && otroTexto ? otroTexto : tipoIncidente}
        </Text>
      </TouchableOpacity>

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

      {/* Modal para tipo de incidente - sin cambios */}
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
  selectedPlace: {
    marginBottom: 20,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  otroContainer: {
    marginBottom: 20,
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
});

export default ReportScreen;