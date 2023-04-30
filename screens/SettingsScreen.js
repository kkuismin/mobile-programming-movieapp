import { StyleSheet, View, Alert } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from "firebase/auth";

import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function SettingsScreen() {

  const logout = async () => {
    try {
      await signOut(auth)
      Alert.alert("Signed out")
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Sign out</Text>
      <View style={styles.logoutContainer}>
        <Button 
          titleStyle={{ fontSize: 16 }}
          color='#7D1538'
          title='Sign out' 
          onPress={() => logout()} />
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
  },
  logoutContainer: {
    marginTop: 60,
  }
});