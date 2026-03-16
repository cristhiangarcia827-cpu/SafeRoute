import React, { useState } from 'react';
import {
  View,
  Text,
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
import { commonStyles, routeReportStyles } from '../styles/screenStyles';

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
    <ScrollView contentContainerStyle={routeReportStyles.container}>
      <Text style={commonStyles.label}>Lugar del incidente *</Text>
      <TouchableOpacity
        style={commonStyles.selectButton}
        onPress={() => {
          setLugarModalVisible(true);
          setSearchText('');
        }}
      >
        <Text style={commonStyles.selectButtonText}>
          {lugar ? getNombreLugar(lugar) : 'Seleccionar lugar'}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={lugarModalVisible}
        onRequestClose={() => {
          setLugarModalVisible(false);
          setSearchText('');
        }}
      >
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text style={commonStyles.modalTitle}>Selecciona el lugar</Text>
            <TextInput
              style={commonStyles.searchInput}
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
                  style={commonStyles.modalItem}
                  onPress={() => {
                    setLugar(item.value);
                    setLugarModalVisible(false);
                    setSearchText('');
                  }}
                >
                  <Text style={commonStyles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              style={commonStyles.list}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={commonStyles.emptyText}>No se encontraron lugares</Text>
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

      <Text style={commonStyles.label}>Tipo de incidente *</Text>
      <TouchableOpacity
        style={commonStyles.selectButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={commonStyles.selectButtonText}>
          {tipoIncidente === 'Otro' && otroTexto ? otroTexto : tipoIncidente}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text style={commonStyles.modalTitle}>Selecciona el tipo de incidente</Text>
            {incidentes.map((incidente) => (
              <TouchableOpacity
                key={incidente}
                style={commonStyles.modalItem}
                onPress={() => {
                  setTipoIncidente(incidente);
                  setModalVisible(false);
                  if (incidente !== 'Otro') setOtroTexto('');
                }}
              >
                <Text style={commonStyles.modalItemText}>{incidente}</Text>
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
        <View>
          <Text style={commonStyles.label}>Especifica el tipo *</Text>
          <TextInput
            style={commonStyles.input}
            value={otroTexto}
            onChangeText={setOtroTexto}
            placeholder="Ej: Vandalismo, etc."
          />
        </View>
      )}

      <Text style={commonStyles.label}>Descripción *</Text>
      <TextInput
        style={[commonStyles.input, commonStyles.textArea]}
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
        style={commonStyles.button}
      />

      <CustomButton
        title="Cancelar"
        onPress={() => navigation.goBack()}
        variant="secondary"
        style={commonStyles.button}
      />
    </ScrollView>
  );
};

export default ReportScreen;