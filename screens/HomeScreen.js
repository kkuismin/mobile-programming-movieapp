import { StyleSheet, View, Image, Alert, FlatList } from 'react-native';
import { Text, Button, Skeleton } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue } from 'firebase/database';

import firebaseConfig from '../firebaseConfig';
import apiConfig from '../apiConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function HomeScreen({ navigation }) {

  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const fetchMovies = async () => {

    const url = 'https://moviesdatabase.p.rapidapi.com/titles?list=top_rated_250&info=base_info'
    
    try {
      const response = await fetch(url, apiConfig);
      const data = await response.json();
      setMovies(data.results);
    }catch (e) {
      Alert.alert('Error');
    }

  }

  useEffect(() => {
    fetchMovies();
  }, []);

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

  const ItemSeparator = () => <View
    style={{
      height: 2,
      width: "100%",
      marginBottom: 10,
    }}
  />

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Highest rated movies</Text>
      <View style={{flex:1, margin: 10}}>
        <FlatList
          keyExtractor={item => item.id}
          data={movies}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({item}) =>
            <View style={{flex:1, flexDirection:'row'}}>
              { item.primaryImage ?
                <Image 
                style={styles.img} 
                source={{  uri: item.primaryImage.url }} />
                :
                <Skeleton animation="none" width={100} height={160} style={{marginTop: 10}}/>
              }
              <View style={{flexDirection: 'column', paddingLeft:20, width:'60%'}}> 
                <Text style={styles.h2}>{ item.titleText.text }
                  { item.releaseYear == null ?
                    <Text> (Year unknown)</Text>
                  :
                    <Text> ({ item.releaseYear.year })</Text>
                  }
                </Text>
                <Text style={styles.text}>
                  <Ionicons name="star"> </Ionicons>
                  { item.ratingsSummary.aggregateRating == null ? 
                    <Text>No rating </Text>
                    :
                    <Text>{ item.ratingsSummary.aggregateRating } </Text>
                  } 
                </Text>
                <View style={styles.button}>
                  <Button 
                    titleStyle={{fontSize: 16}}
                    title='Read more'
                    onPress={() => navigation.navigate('Movie details', {movieData: item})}
                  />
                </View>
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
            </View>} />
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
    padding: 10,
  },
  h2: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    marginBottom: 10,
  },
  img: {
    width: 100,
    height: 160,
    marginTop: 10,
  },
  button: {
    width: 100,
    marginBottom: 10,
  }
});
