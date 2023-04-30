import { StyleSheet, View, Image, FlatList, Alert } from 'react-native';
import { Text, Button, Skeleton } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, remove, ref, onValue } from 'firebase/database';

import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function FavoritesScreen() {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const favoritelist = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      setFavorites(favoritelist)
    });
  }, []);

  const deleteFavorite = (key) => {
    remove(
      ref(database, 'items/' + key))
    Alert.alert('Movie deleted from favorites')
  }

  const confirmDelete = (key) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete the movie from your favorites?',
      [
        { 
          text: 'Cancel',
        },
        {
          text: 'Yes',
          onPress: () => deleteFavorite(key),
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
      marginBottom: 10,
    }}
    />

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Favorites</Text>
      <View style={styles.listContainer}>
        <FlatList
          keyExtractor={item => item.key}
          data={favorites}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({item}) =>
            <View style={styles.itemContainer}>
              {item.uri ? (
                <Image 
                  style={styles.img} 
                  source={{ uri: item.uri }} 
                />
              ) : (
                <Skeleton animation="none" width={100} height={160} style={{ marginTop: 10 }}/>
              )}
              <View style={styles.textContainer}>
                <Text style={styles.h2}>{item.title} ({item.year})</Text>
                <Text style={styles.text}>
                  <Ionicons name="star"> </Ionicons>
                  {item.rating == null ? (
                    <Text>No rating</Text>
                  ) : (
                    <Text>{item.rating}</Text>
                  )} 
                </Text>
                <View style={styles.button}>
                  <Button 
                    titleStyle={{ fontSize: 16 }}
                    color='#C9225A'
                    title='Delete' 
                    onPress={() => confirmDelete(item.key)}
                    icon={{
                      size: 16,
                      name: 'trash-outline',
                      type: 'ionicon',
                      color: '#ffffff'}}
                  />
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
    padding: 10,
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10,
  },
  listContainer: {
    flex: 1, 
    margin: 10,
  },
  itemContainer: {
    flex: 1, 
    flexDirection:'row', 
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: 'column', 
    paddingLeft:20, 
    width:'60%'
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  img: {
    width: 100,
    height: 160,
    marginTop: 10,
  },
  button: {
    width: 100,
    marginTop: 10,
  }
});