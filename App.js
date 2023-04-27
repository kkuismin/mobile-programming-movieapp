import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import Navigation from './navigation/Navigation'
import SigninScreen from './screens/SigninScreen';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  })
    
  const getScreen = () => {
    if (loggedIn) {
      return <Navigation />;
    }
    return (
      <View style={styles.container}>
        <SigninScreen />
      </View>
    )
  }

  return (
    getScreen()
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
