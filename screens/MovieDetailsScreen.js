import { StyleSheet, View, Image, Alert, FlatList } from 'react-native';
import { Text, Button, Skeleton, Input } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue } from 'firebase/database';

import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function MovieDetailsScreen({ route, navigation }) {

  const { movieData } = route.params;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const favoritelist = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      setFavorites(favoritelist)
    });
  }, []);

  const addFavorite = (item) => {
    push(
      ref(database, 'items/'),
      { 'title': item.titleText.text, 'uri': item.primaryImage.url, 'year': item.releaseYear.year, 'rating': item.ratingsSummary.aggregateRating });
  }

  return (
    <View style={styles.container}>
      <Text>{movieData.titleText.text}</Text>
      <View style={styles.button}>
        <Button
          titleStyle={{fontSize: 16}}
          title='Favorite'
          onPress={() => addFavorite(item)}                  
          icon={{
          size: 16,
          name: 'bookmark-outline',
          type: 'ionicon',
          color: '#ffffff'}}
          />
      </View>
    </View>
    
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 10,
  },
  h2: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    width: 350,
    marginLeft: 20,
  },
  searchButton: {
    marginRight: 20,
  },
  picker: {
    height: 50, 
    width: 200,
    borderColor: "lightgrey",
    borderWidth: 1,
    marginLeft: 20,
  },
  img: {
    width: 100,
    height: 160,
    marginTop: 10,
  },
  text: {
    marginBottom: 10,
  },
  button: {
    width: 100,
  },
});
