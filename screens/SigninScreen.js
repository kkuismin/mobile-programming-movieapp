import { StyleSheet, View, Alert } from 'react-native';
import { Text, Button, Input } from '@rneui/themed';
import { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function SigninScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      if (error.code == "auth/invalid-email" || error.code == "auth/wrong-password") {
        Alert.alert("Your email or password was incorrect")
      } else {
        Alert.alert("There was a problem with your request")
      }
    }
  }

  const createUser = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      if (error.code == "auth/email-already-in-use") {
        Alert.alert("Email already in use")
      } else if (error.code == "auth/invalid-email") {
        Alert.alert("Email is incorrect")
      } else {
        Alert.alert("There was a problem with your request")
      }
    }
  }

  return (
    <View>
      <Text style={styles.h1}>Sign in</Text>
      <Input 
        inputContainerStyle={ styles.input }
        placeholder='Email'
        onChangeText={email => setEmail(email)}
        value={email} />
      <Input 
        inputContainerStyle={ styles.input }
        secureTextEntry
        placeholder='Password'
        onChangeText={password => setPassword(password)}
        value={password} />
      <View style={styles.button}>
        <Button title='Sign in' onPress={signInUser}/>
      </View>
      <View style={styles.button}>
        <Button title='Register' onPress={createUser}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  input: {
    width: 300,
    marginBottom: 10,
  },
  button: {
    marginBottom: 20,
  }
});