import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Navigation from './navigation/Navigation'
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Stack = createNativeStackNavigator();

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
    } else {
      return (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="Sign in" component={SigninScreen} />
            <Stack.Screen name="Sign up" component={SignupScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }
    {/*return (
      <View style={styles.container}>
        <SigninScreen />
    </View>
    )*/}
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
