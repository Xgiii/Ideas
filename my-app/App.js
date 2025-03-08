import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import LoginScreen from './screens/LoginScreen';
import ActivityScreen from './screens/ActivityScreen'; // Make sure this exists

const Stack = createStackNavigator();

export default function App() {
  const [logged, setLogged] = useState(false);

  const onClickedButton = () => {
    setLogged(true); // Set the user as logged in
  };

  return (
    <NavigationContainer>
      {logged ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
          <Stack.Screen name="ExcercisesScreen" component={ActivityScreen} />
          <Stack.Screen name="PlansScreen" component={ActivityScreen} />
          <Stack.Screen name="ConsultationsScreen" component={ActivityScreen} />

        </Stack.Navigator>
      ) : (
        <LoginScreen buttonDown={onClickedButton} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5c9ae6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
