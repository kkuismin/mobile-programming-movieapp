import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';

const Tab = createBottomTabNavigator();

export default function Navigation() {

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: { backgroundColor: '#7D1538' },
          //headerShown: false,
          headerStyle: { backgroundColor: '#7D1538' },
          headerTitleStyle: { color: 'white' },
          tabBarIcon: ({ focused, size, color }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'md-home';
            } else if (route.name === 'Search') {
              iconName = 'search-outline';
            } else if (route.name === 'Favorites') {
              iconName = 'bookmark-outline';
            }
            return <Ionicons name={iconName} size={size} color={'white'} />; 
          },
          tabBarLabelStyle: { color: 'white' },
      })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="MovieDetails" component={MovieDetailsScreen} options={{ tabBarButton: () => null }}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
  
}