import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList } from '../navigation/types'; // Importamos los tipos de las pestañas
import CustomButton from '../components/CustomButton';
import AlertService from '../services/AlertService';
import { IncidenteType } from '../models/Report';

// Definimos el tipo de navegación para esta pantalla (está dentro de la pestaña "Reportar")
type ReportScreenNavigationProp = StackNavigationProp<TabParamList, 'Reportar'>;

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<ReportScreenNavigationProp>();

  const [lugar, setLugar] = useState('');
  const [tipoIncidente, setTipoIncidente] = useState<IncidenteType>('Robo');
  const [descripcion, setDescripcion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const incidentes: IncidenteType[] = ['Robo', 'Asalto', 'Acoso', 'Zona Oscura', 'Otro'];

  const handleSubmit = () => {
    if (!lugar.trim() || !descripcion.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      lugar: lugar.trim(),
      tipoIncidente,
      descripcion: descripcion.trim(),
      fecha: new Date().toLocaleDateString(),
    };

    AlertService.addReport(newReport);

    Alert.alert(
      'Éxito',
      'Reporte guardado correctamente',
      [
        {
          text: 'Ver reportes',
          onPress: () => {
            // Navegamos a la pestaña "Alertas" (nombre definido en TabsNavigator)
            navigation.navigate('Alertas');
          },
        },
        {
          text: 'Nuevo reporte',
          onPress: () => {
            setLugar('');
            setDescripcion('');
          },
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Lugar del incidente *</Text>
      <TextInput
        style={styles.input}
        value={lugar}
        onChangeText={setLugar}
        placeholder="Ej: Parque Central, Calle 50, etc."
      />

      <Text style={styles.label}>Tipo de incidente *</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>{tipoIncidente}</Text>
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