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
import AlertService from '../services/AlertService';
import { IncidenteType } from '../models/Report';
import { lugares, getLugaresOptions } from '../utils/routesData';

type ReportScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Reportar'>;

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<ReportScreenNavigationProp>();

  const [lugar, setLugar] = useState<string>('');
  const [tipoIncidente, setTipoIncidente] = useState<IncidenteType | string>('Robo');
  const [descripcion, setDescripcion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [lugarModalVisible, setLugarModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [otroTexto, setOtroTexto] = useState('');

  const incidentes: (IncidenteType | 'Otro')[] = ['Robo', 'Asalto', 'Acoso', 'Zona Oscura', 'Otro'];
  const lugaresOptions = getLugaresOptions();

  const filteredOptions = lugaresOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = () => {
    if (!lugar) {
      Alert.alert('Error', 'Selecciona un lugar');
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert('Error', 'Escribe una descripción');
      return;
    }

    const lugarSeleccionado = lugares.find(l => l.id === lugar);
    const nombreLugar = lugarSeleccionado ? lugarSeleccionado.nombre : 'Desconocido';

    // Determinar el tipo final
    const tipoFinal = tipoIncidente === 'Otro' ? otroTexto.trim() : tipoIncidente;
    if (tipoIncidente === 'Otro' && !tipoFinal) {
      Alert.alert('Error', 'Especifica el tipo de incidente');
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      lugar: nombreLugar,
      tipoIncidente: tipoFinal,
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
          onPress: () => navigation.navigate('Alertas'),
        },
        {
          text: 'Nuevo reporte',
          onPress: () => {
            setLugar('');
            setTipoIncidente('Robo');
            setDescripcion('');
            setOtroTexto('');
          },
          style: 'cancel',
        },
      ]
    );
  };

  const getNombreLugar = (id: string) => {
    return lugares.find(l => l.id === id)?.nombre || 'Seleccionar lugar';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Lugar del incidente *</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          setLugarModalVisible(true);
          setSearchText('');
        }}
      >
        <Text style={styles.selectButtonText}>
          {lugar ? getNombreLugar(lugar) : 'Seleccionar lugar'}
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
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona el lugar</Text>
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
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setLugar(item.value);
                    setLugarModalVisible(false);
                    setSearchText('');
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.emptyText}>No se encontraron lugares</Text>
              }
            />
            <CustomButton
              title="Cancelar"
              onPress={() => {
                setLugarModalVisible(false);
                setSearchText('');
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

      {/* Modal para tipo de incidente */}
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
  otroContainer: {
    marginBottom: 20,
  },
});

export default ReportScreen;