import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AlertItem from '../components/AlertItem';
import CustomButton from '../components/CustomButton';
import ReportService from '../services/ReportService';
import { Report } from '../models/Report';

const AlertListScreen: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = useCallback(async () => {
    try {
      const allReports = await ReportService.getAllReports();
      setReports(allReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Eliminar reporte',
      '¿Estás seguro de que quieres eliminar este reporte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await ReportService.deleteReport(id);
              await loadReports();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el reporte');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = async () => {
    if (reports.length === 0) return;

    Alert.alert(
      'Eliminar todos los reportes',
      '¿Estás seguro de que quieres eliminar todos los reportes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar todos',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const report of reports) {
                await ReportService.deleteReport(report.id);
              }
              await loadReports();
            } catch (error) {
              Alert.alert('Error', 'No se pudieron eliminar todos los reportes');
            }
          },
        },
      ]
    );
  };

  if (reports.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay reportes disponibles</Text>
        <Text style={styles.emptySubtext}>
          Los reportes que agregues aparecerán aquí
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alertas Reportadas ({reports.length})</Text>
        {reports.length > 0 && (
          <CustomButton
            title="Eliminar todos"
            onPress={handleDeleteAll}
            variant="danger"
            style={styles.deleteAllButton}
            textStyle={styles.deleteAllText}
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
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FF3B30',
  },
  deleteAllText: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default AlertListScreen;