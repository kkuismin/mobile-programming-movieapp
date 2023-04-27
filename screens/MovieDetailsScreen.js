import { StyleSheet, View, Image, Alert, ScrollView } from 'react-native';
import { Text, Button, Skeleton } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue } from 'firebase/database';

import firebaseConfig from '../firebaseConfig';
import apiConfig from '../apiConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function MovieDetailsScreen({ route, navigation }) {

  const { movieData } = route.params;
  const [favorites, setFavorites] = useState([]);
  const [cast, setCast] = useState([]);

  const id = movieData.id;
  
  const searchCast = async () => {

    const url = `https://moviesdatabase.p.rapidapi.com/titles/${id}?info=principalCast`;

    try {
      const response = await fetch(url, apiConfig);
      const data = await response.json();
      if (data.results.length == 0) {
        Alert.alert('Cast not found');
      } else {
        setCast(data.results);
      }
    }catch (e) {
      Alert.alert('Error');
    }
  }

  useEffect(() => {
    searchCast();
  }, [id]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const favoritelist = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      setFavorites(favoritelist)
    });
  }, []);

  const addFavorite = (movieData) => {
    push(
      ref(database, 'items/'),
      { 
        'title': movieData.titleText.text, 
        'uri': movieData.primaryImage.url, 
        'year': movieData.releaseYear.year, 
        'rating': movieData.ratingsSummary.aggregateRating 
      });
    Alert.alert('Movie added to favorites')
  }

  const confirmFavorite = (movieData) => {
    Alert.alert(
      'Add the movie to favorites?',
      '',
      [
        { 
          text: 'Cancel',
        },
        {
          text: 'Yes',
          onPress: () => addFavorite(movieData),
        }
      ],
      {
        cancelable: true
      }
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.movieContainer} 
        showsVerticalScrollIndicator={false}
      >
        {movieData.primaryImage ? (
          <Image style={styles.img} source={{ uri: movieData.primaryImage.url }} />
        ) : (
          <Skeleton animation="none" width={200} height={300} style={{ marginTop: 10 }}/>
        )}
        <Text style={styles.h1}>{movieData.titleText.text}</Text>
        <View style={styles.textContainer}>
        <Text style={styles.h2}>Release year:</Text>
          {movieData.releaseYear == null ? (
            <Text style={styles.text}>Year unknown</Text>
          ) : (
            <Text style={styles.text}>{movieData.releaseYear.year}</Text>
          )}
          <Text style={styles.h2}>Rating:</Text>
          {movieData.ratingsSummary.aggregateRating == null ? (
            <Text style={styles.text}>No rating</Text>
          ) : (
            <Text style={styles.text}>{movieData.ratingsSummary.aggregateRating}</Text>
          )}
          <Text style={styles.h2}>Genres:</Text>
          <Text style={styles.text}>
            {movieData.genres.genres.map((genre) => (
              <Text key={genre.id}>{genre.text} </Text>
            ))}
          </Text>
          <Text style={styles.h2}>Main Cast:</Text>
          {cast.principalCast == undefined || cast.principalCast.length == 0 ? (
            <Text style={styles.text}>Not found</Text>
          ) : (
            <Text style={styles.text}>
              {cast.principalCast[0].credits.map((actor) => (
                <Text key={actor.name.id}>{actor.name.nameText.text} </Text>
              ))}
            </Text>
          )}
          <Text style={styles.h2}>Plot summary: </Text>
          {movieData.plot == null ? (
            <Text style={styles.text}>No summary</Text>
          ) : (
            <Text style={styles.text}>{movieData.plot.plotText.plainText}</Text>
          )}
        </View>
        <View style={styles.button}>
          <Button
            titleStyle={{ fontSize: 16 }}
            title='Favorite'
            color='#7D1538'
            onPress={() => confirmFavorite(movieData)}                  
            icon={{
              size: 16,
              name: 'bookmark-outline',
              type: 'ionicon',
              color: '#ffffff'}} 
          />
        </View>
        <View style={styles.button}>
          <Button
            titleStyle={{ fontSize: 16 }}
            title='Back'
            color='#C95F82'
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  movieContainer: {
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  img: {
    width: 200,
    height: 300,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    width: 100,
    marginBottom: 20,
  },
});
