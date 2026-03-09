// src/components/MapVisualizer.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { nodePositions, connections } from '../utils/mapData';

interface MapVisualizerProps {
  highlightedRoute?: string[]; // array de ids de lugares en orden
}

const { width, height } = Dimensions.get('window');

const MapVisualizer: React.FC<MapVisualizerProps> = ({ highlightedRoute = [] }) => {
  // Convertir porcentajes a píxeles
  const getPosition = (xPercent: number, yPercent: number) => {
    return {
      left: (xPercent / 100) * width,
      top: (yPercent / 100) * height * 0.6, // limitar altura para no ocupar toda la pantalla
    };
  };

  // Determinar si una conexión está en la ruta resaltada
  const isConnectionHighlighted = (fromId: string, toId: string) => {
    if (highlightedRoute.length === 0) return false;
    for (let i = 0; i < highlightedRoute.length - 1; i++) {
      if (
        (highlightedRoute[i] === fromId && highlightedRoute[i + 1] === toId) ||
        (highlightedRoute[i] === toId && highlightedRoute[i + 1] === fromId)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <View style={styles.container}>
      {/* Dibujar conexiones (líneas) */}
      {connections.map((conn, index) => {
        const from = nodePositions.find(n => n.id === conn.from);
        const to = nodePositions.find(n => n.id === conn.to);
        if (!from || !to) return null;
        const fromPos = getPosition(from.x, from.y);
        const toPos = getPosition(to.x, to.y);
        // Calcular ángulo y longitud para línea
        const length = Math.sqrt(
          Math.pow(toPos.left - fromPos.left, 2) + Math.pow(toPos.top - fromPos.top, 2)
        );
        const angle = Math.atan2(toPos.top - fromPos.top, toPos.left - fromPos.left);
        const isHighlighted = isConnectionHighlighted(conn.from, conn.to);
        return (
          <View
            key={`${conn.from}-${conn.to}-${index}`}
            style={[
              styles.line,
              {
                left: fromPos.left,
                top: fromPos.top,
                width: length,
                transform: [{ rotate: `${angle}rad` }],
                backgroundColor: isHighlighted ? '#FF3B30' : '#999',
              },
            ]}
          />
        );
      })}

      {/* Dibujar nodos */}
      {nodePositions.map(node => {
        const pos = getPosition(node.x, node.y);
        const isHighlighted = highlightedRoute.includes(node.id);
        return (
          <View
            key={node.id}
            style={[
              styles.node,
              pos,
              { backgroundColor: isHighlighted ? '#FF3B30' : '#007AFF' },
            ]}
          >
            <Text style={styles.nodeText}>{node.name.charAt(0)}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: Dimensions.get('window').height * 0.6,
    backgroundColor: '#E8F4F8',
    overflow: 'hidden',
  },
  node: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    marginLeft: -20, // centrar el punto
    marginTop: -20,
  },
  nodeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  line: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#999',
    transformOrigin: 'left',
  },
});

export default MapVisualizer;