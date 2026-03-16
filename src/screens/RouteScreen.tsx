import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TabParamList } from '../navigation/types';
import CustomButton from '../components/CustomButton';
import { cityGraph, getLugaresOptions, lugares, nombreToId } from '../utils/routesData';
import AlertService from '../services/AlertService';
import { commonStyles, routeReportStyles } from '../styles/screenStyles';

type RouteScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Ruta'>;

const RouteScreen: React.FC = () => {
  const navigation = useNavigation<RouteScreenNavigationProp>();

  const [origen, setOrigen] = useState<string>('');
  const [destino, setDestino] = useState<string>('');
  const [origenModal, setOrigenModal] = useState(false);
  const [destinoModal, setDestinoModal] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [searchText, setSearchText] = useState('');

  const lugaresOptions = getLugaresOptions();
  const filteredOptions = lugaresOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const buscarRuta = () => {
    if (!origen || !destino) {
      setMensajeError('Selecciona origen y destino');
      return;
    }
    if (origen === destino) {
      setMensajeError('El origen y destino no pueden ser el mismo');
      return;
    }

    const reports = AlertService.getAllReports();
    const lugaresConReportes = reports.map(r => r.lugar);
    const idsProhibidos = new Set<string>();
    lugaresConReportes.forEach(nombre => {
      const id = nombreToId[nombre];
      if (id) idsProhibidos.add(id);
    });
    idsProhibidos.delete(origen);
    idsProhibidos.delete(destino);

    const ruta = cityGraph.encontrarRutaEvitando(origen, destino, idsProhibidos);
    if (ruta) {
      navigation.navigate('Inicio', { origen, destino, ruta });
    } else {
      setMensajeError('No se encontró una ruta segura. Intenta con otro origen/destino o reporta menos zonas.');
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

  const getNombreLugar = (id: string) => {
    return lugares.find((l) => l.id === id)?.nombre || id;
  };

  return (
    <ScrollView contentContainerStyle={routeReportStyles.container}>
      <Text style={commonStyles.title}>Buscar Ruta Segura</Text>
      <Text style={commonStyles.subtitle}>Selecciona origen y destino</Text>

      <View>
        <Text style={commonStyles.label}>Origen:</Text>
        <TouchableOpacity
          style={commonStyles.selectButton}
          onPress={() => {
            setOrigenModal(true);
            setDestinoModal(false);
            setSearchText('');
          }}
        >
          <Text style={commonStyles.selectButtonText}>
            {origen ? getNombreLugar(origen) : 'Seleccionar origen'}
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={commonStyles.label}>Destino:</Text>
        <TouchableOpacity
          style={commonStyles.selectButton}
          onPress={() => {
            setDestinoModal(true);
            setOrigenModal(false);
            setSearchText('');
          }}
        >
          <Text style={commonStyles.selectButtonText}>
            {destino ? getNombreLugar(destino) : 'Seleccionar destino'}
          </Text>
        </TouchableOpacity>
      </View>

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
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text style={commonStyles.modalTitle}>
              Seleccionar {origenModal ? 'origen' : 'destino'}
            </Text>
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
                  onPress={() => handleSelect(item.value)}
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
                setOrigenModal(false);
                setDestinoModal(false);
                setSearchText('');
              }}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>

      <View style={routeReportStyles.buttonContainer}>
        <CustomButton
          title="Buscar Ruta Segura"
          onPress={buscarRuta}
          variant="primary"
          style={routeReportStyles.halfButton}
        />
        <CustomButton
          title="Reiniciar"
          onPress={resetSelection}
          variant="secondary"
          style={routeReportStyles.halfButton}
        />
      </View>

      {mensajeError && (
        <View style={commonStyles.errorContainer}>
          <Text style={commonStyles.errorText}>{mensajeError}</Text>
        </View>
      )}

      <View style={routeReportStyles.graphContainer}>
        <Text style={routeReportStyles.graphTitle}>Lugares disponibles:</Text>
        {lugares.map((lugar) => (
          <View key={lugar.id} style={routeReportStyles.lugarInfo}>
            <Text style={routeReportStyles.lugarName}>📍 {lugar.nombre}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RouteScreen;