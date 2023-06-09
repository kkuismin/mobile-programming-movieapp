import { StyleSheet, View, Alert } from 'react-native';
import { Text, Button, Input, Image } from '@rneui/themed';
import { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function SigninScreen({ navigation }) {

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

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../assets/cinema.jpg' )}/>
      <View style={styles.textContainer}>
        <Text style={styles.h1}>MovieApp</Text>
        <Text style={styles.h2}>Sign in</Text>
        <Input 
          inputContainerStyle={styles.input}
          placeholder='Email'
          onChangeText={email => setEmail(email)}
          value={email} 
        />
        <Input 
          inputContainerStyle={styles.input}
          secureTextEntry
          placeholder='Password'
          onChangeText={password => setPassword(password)}
          value={password} 
        />
        <View style={styles.button}>
          <Button title='SIGN IN' color='#7D1538' containerStyle={{width: 100}} onPress={signInUser} />
        </View>
        <View style={styles.registrationContainer}>
          <Text style={styles.text}>Don't have an account yet?</Text>
          <View style={styles.button}>
            <Button title='REGISTER' color='#C95F82' containerStyle={{width: 100}} onPress={() => navigation.navigate('Sign up')} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  textContainer: {
    paddingTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
  },
  img: {
    width: '100%',
    height: 300,
  },
  h1: {
    fontSize: 40,
    fontWeight: 'bold',
    paddingBottom: 30,
    textAlign: 'center'
  },
  h2: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  input: {
    width: 300,
    marginBottom: 10,
  },
  registrationContainer: {
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 20,
  },
  button: {
    marginBottom: 20,
    alignItems: 'center',
  }
});