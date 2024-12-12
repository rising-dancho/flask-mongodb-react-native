import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, FAB } from 'react-native-paper';

function Home({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setLoading(true);
    fetch('https://mongodb-flask-backend.up.railway.app/get', {
      method: 'GET',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        return res.json();
      })
      .then((article) => {
        setData(article);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to load data');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const clickedItem = useCallback((item) => {
    navigation.navigate('Details', { data: item });
  }, [navigation]);

  const renderData = useCallback((item) => (
    <Card style={styles.cardStyle}>
      <Text style={styles.title} onPress={() => clickedItem(item)}>
        {item.title}
      </Text>
      <Text style={styles.body}>{item.body}</Text>
    </Card>
  ), [clickedItem]);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#381F71" style={styles.loader} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={data}
        renderItem={({ item }) => renderData(item)}
        onRefresh={loadData}
        refreshing={loading}
        keyExtractor={(item) => `${item._id}`}
        ListFooterComponent={() => <Text style={styles.footer}>© 2024 adfinem</Text>}
        style={styles.flatlist}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  cardStyle: {
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  footer: {
    textAlign: 'center',
    padding: 10,
    color: '#381F71',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 4,
    color: '#381F71',
  },
  body: {
    fontSize: 14,
    color: '#555',
  },
  fab: {
    position: 'absolute',
    margin: 10,
    right: 0,
    bottom: 0,
    width: 56,
    height: 56,
  },
});

export default Home;