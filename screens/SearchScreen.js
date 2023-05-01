import { StyleSheet, View, Keyboard, Image, Alert, FlatList } from 'react-native';
import { Text, Button, Skeleton, Input, Icon } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue } from 'firebase/database';

import firebaseConfig from '../firebaseConfig';
import apiConfig from '../apiConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function SearchScreen({ navigation }) {

  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState();

  const searchMovies = async () => {

    const url = `https://moviesdatabase.p.rapidapi.com/titles/search/title/${search}?titleType=movie&genre=${selectedGenre}&endYear=2023&exact=false&sort=year.decr&info=base_info`;

    try {
      const response = await fetch(url, apiConfig);
      const data = await response.json();
      if (data.results.length == 0) {
        Alert.alert('Movie not found');
      } else {
        setMovies(data.results);
      }
    } catch (e) {
      Alert.alert('Error');
    }
    Keyboard.dismiss();
  }

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
      { 
        'title': item.titleText.text, 
        'uri': item.primaryImage, 
        'year': item.releaseYear, 
        'rating': item.ratingsSummary
      });
      Alert.alert('Movie added to favorites')
  }

  const confirmFavorite = (item) => {
    Alert.alert(
      'Add the movie to favorites?',
      '',
      [
        { 
          text: 'Cancel',
        },
        {
          text: 'Yes',
          onPress: () => addFavorite(item),
        }
      ],
      {
        cancelable: true
      }
    );
  }

  const ItemSeparator = () => <View
    style={{
      height: 2,
      width: "100%",
      marginBottom: 20,
    }}
    />

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Movie search</Text>
      <Input 
        inputContainerStyle={styles.input}
        placeholder='Movie title'
        onChangeText={search => setSearch(search)}
        value={search} 
      />
      <View style={styles.searchContainer}>
        <View style={{ flex: 1 }}>
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedGenre}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedGenre(itemValue)
            }>
              <Picker.Item label="Choose a genre" value="Choose a genre" />
              <Picker.Item label="Action" value="Action" />
              <Picker.Item label="Adventure" value="Adventure" />
              <Picker.Item label="Animation" value="Animation" />
              <Picker.Item label="Comedy" value="Comedy" />
              <Picker.Item label="Crime" value="Crime" />
              <Picker.Item label="Documentary" value="Documentary" />
              <Picker.Item label="Drama" value="Drama" />
              <Picker.Item label="Family" value="Family" />
              <Picker.Item label="Fantasy" value="Fantasy" />
              <Picker.Item label="Horror" value="Horror" />
              <Picker.Item label="Musical" value="Musical" />
              <Picker.Item label="Romance" value="Romance" />
              <Picker.Item label="Sci-Fi" value="Sci-Fi" />
              <Picker.Item label="Thriller" value="Thriller" />
            </Picker>
          </View>
        </View>
        <View style={styles.searchButton}>
          <Button             
            title='Search' 
            onPress={searchMovies} 
            color='#C95F82'
            icon={{
              size: 16,
              name: 'search-outline',
              type: 'ionicon',
              color: '#ffffff'}} 
          />
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          keyExtractor={item => item.id}
          data={movies}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({item}) =>
            <View style={styles.itemContainer}>
              {item.primaryImage ? (
                <Image style={styles.img} source={{ uri: item.primaryImage.url }} />
              ) : (
                <Skeleton animation="none" width={100} height={160} style={{ marginTop: 10 }}/>
              )}
              <View style={styles.textContainer}> 
                <Text style={styles.h2}>{item.titleText.text} 
                  {item.releaseYear == null ? (
                    <Text> (Year unknown)</Text>
                  ) : (
                    <Text> ({item.releaseYear.year})</Text>
                  )}
                </Text>
                <Text style={styles.text}>
                  <Ionicons name="star"> </Ionicons>
                  {item.ratingsSummary.aggregateRating == null ? (
                    <Text>No rating</Text>
                  ) : (
                    <Text>{item.ratingsSummary.aggregateRating.toFixed(1)}</Text>
                  )} 
                </Text>
                <View style={styles.buttonContainer}>
                  <View style={styles.button}>
                    <Button 
                      titleStyle={{ fontSize: 16 }}
                      title='Read more'
                      color='#C95F82'
                      onPress={() => navigation.navigate('Movie details', { movieData: item })} 
                    />
                  </View>
                  <View style={{ flex:1 }}>
                    <View style={styles.button}>
                      <Icon
                        onPress={() => confirmFavorite(item)}                  
                        size={30}           
                        name='bookmark'
                        type='ionicon'
                        color='#7D1538'
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>} 
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    width: 350,
    marginLeft: 20,
  },
  searchContainer: {
    flexDirection: 'row', 
    margin: 10,
  },
  picker: {
    height: 50, 
    width: 200,
    borderColor: "lightgrey",
    borderWidth: 1,
    marginLeft: 20,
  },
  searchButton: {
    marginRight: 20,
  },
  listContainer: {
    flex:1, 
    margin: 10,
  },
  itemContainer: {
    flex: 1,
    flexDirection:'row',
  },
  img: {
    width: 100,
    height: 160,
    marginTop: 10,
  },
  textContainer: {
    flexDirection: 'column', 
    paddingLeft:20, 
    width:'60%',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1, 
    flexDirection: 'row',
  },
  button: {
    width: 100,
    marginTop: 10,
    marginRight: 10,
  },
});