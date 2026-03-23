import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
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

  const handleSearch = async (text: string) => {
    if (text.length > 2) {
      setLoading(true);
      const results = await RoutingService.searchPlaces(text);
      setPredictions(results);
      setLoading(false);
    } else {
      setPredictions([]);
    }
  };

  const handleSelect = (place: Place) => {
    onPlaceSelected(place);
    setQuery('');
    setPredictions([]);
  };

  useEffect(() => {
    let timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [query]);


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
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
              <Text style={styles.mainText}>{item.name}</Text>
              <Text style={styles.secondaryText}>{item.address}</Text>
            </TouchableOpacity>
          )}
        />
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