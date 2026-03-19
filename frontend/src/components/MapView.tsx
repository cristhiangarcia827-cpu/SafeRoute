import React from 'react';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Place } from '../models/Place';

interface MapViewComponentProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  routePolyline?: { latitude: number; longitude: number }[];
  markers?: Place[];
  onRegionChange?: (region: any) => void;
}

const MapViewComponent: React.FC<MapViewComponentProps> = ({
  region,
  routePolyline,
  markers,
  onRegionChange,
}) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChange}
      >
        {routePolyline && (
          <Polyline
            coordinates={routePolyline}
            strokeColor="#4CAF50"
            strokeWidth={4}
          />
        )}
        {markers?.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.name}
            description={marker.address}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapViewComponent;