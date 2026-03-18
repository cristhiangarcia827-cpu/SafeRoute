import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AlertItem from '../components/AlertItem';
import CustomButton from '../components/CustomButton';
import AlertService from '../services/AlertService';
import { Report } from '../models/Report';
import { commonStyles, alertListStyles } from '../styles/screenStyles';

const AlertListScreen: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = () => {
    const allReports = AlertService.getAllReports();
    setReports(allReports);
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar reporte',
      '¿Estás seguro de que quieres eliminar este reporte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            AlertService.deleteReport(id);
            loadReports();
          },
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    if (reports.length === 0) return;

    Alert.alert(
      'Eliminar todos los reportes',
      '¿Estás seguro de que quieres eliminar todos los reportes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar todos',
          style: 'destructive',
          onPress: () => {
            reports.forEach(report => AlertService.deleteReport(report.id));
            loadReports();
          },
        },
      ]
    );
  };

  if (reports.length === 0) {
    return (
      <View style={alertListStyles.emptyContainer}>
        <Text style={alertListStyles.emptyText}>No hay reportes disponibles</Text>
        <Text style={alertListStyles.emptySubtext}>
          Los reportes que agregues aparecerán aquí
        </Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={alertListStyles.header}>
        <Text style={alertListStyles.title}>Alertas Reportadas ({reports.length})</Text>
        {reports.length > 0 && (
          <CustomButton
            title="Eliminar todos"
            onPress={handleDeleteAll}
            variant="danger"
            style={alertListStyles.deleteAllButton}
            textStyle={alertListStyles.deleteAllText}
          />
        )}
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlertItem report={item} onDelete={handleDelete} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={alertListStyles.listContent}
      />
    </View>
  );
};

export default AlertListScreen;