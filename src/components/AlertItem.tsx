import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Report } from '../models/Report';
import { alertItemStyles } from '../styles/screenStyles';

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
    <View style={alertItemStyles.container}>
      <View style={alertItemStyles.header}>
        <View style={alertItemStyles.titleContainer}>
          <Text style={alertItemStyles.lugar}>{report.lugar}</Text>
          <View
            style={[
              alertItemStyles.badge,
              { backgroundColor: getIncidentColor(report.tipoIncidente) },
            ]}
          >
            <Text style={alertItemStyles.badgeText}>{report.tipoIncidente}</Text>
          </View>
        </View>
        <Text style={alertItemStyles.fecha}>{report.fecha}</Text>
      </View>
      
      <Text style={alertItemStyles.descripcion}>{report.descripcion}</Text>
      
      {onDelete && (
        <TouchableOpacity
          style={alertItemStyles.deleteButton}
          onPress={() => onDelete(report.id)}
        >
          <Text style={alertItemStyles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AlertItem;