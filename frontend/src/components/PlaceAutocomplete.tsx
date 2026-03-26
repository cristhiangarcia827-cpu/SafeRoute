import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import RoutingService from '../services/RoutingService';
import { Place } from '../models/Place';

interface PlaceAutocompleteProps {
  onPlaceSelected: (place: Place) => void;
  placeholder?: string;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({ onPlaceSelected, placeholder }) => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const lastQueryRef = useRef('');

  const handleSearch = async (text: string) => {
    if (text === lastQueryRef.current) return;
    lastQueryRef.current = text;

    if (text.length > 2) {
      setLoading(true);
      const results = await RoutingService.searchPlaces(text);
      setPredictions(results);
      setLoading(false);
    } else {
      setPredictions([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (place: Place) => {
    onPlaceSelected(place);
    setQuery('');
    setPredictions([]);
    lastQueryRef.current = '';
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder || 'Buscar lugar...'}
      />
      {loading && <ActivityIndicator style={styles.loader} />}
      {predictions.length > 0 && (
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          {predictions.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleSelect(item)}
              style={styles.item}
            >
              <Text style={styles.mainText}>{item.name}</Text>
              <Text style={styles.secondaryText}>{item.address}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  loader: {
    marginTop: 10,
  },
  list: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mainText: {
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
  },
});

export default PlaceAutocomplete;