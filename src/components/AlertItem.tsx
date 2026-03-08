import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Report } from '../models/Report';

interface AlertItemProps {
  report: Report;
  onDelete?: (id: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ report, onDelete }) => {
  const getIncidentColor = (tipo: string) => {
    switch (tipo) {
      case 'Robo':
        return '#FF3B30';
      case 'Asalto':
        return '#FF9500';
      case 'Acoso':
        return '#FF2D55';
      case 'Zona Oscura':
        return '#5856D6';
      default:
        return '#8E8E93';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.lugar}>{report.lugar}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getIncidentColor(report.tipoIncidente) },
            ]}
          >
            <Text style={styles.badgeText}>{report.tipoIncidente}</Text>
          </View>
        </View>
        <Text style={styles.fecha}>{report.fecha}</Text>
      </View>
      
      <Text style={styles.descripcion}>{report.descripcion}</Text>
      
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(report.id)}
        >
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lugar: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  fecha: {
    color: '#8E8E93',
    fontSize: 12,
  },
  descripcion: {
    fontSize: 14,
    color: '#3A3A3A',
    marginBottom: 10,
    lineHeight: 20,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AlertItem;