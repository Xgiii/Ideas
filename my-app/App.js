import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import ActivityScreen from './screens/ActivityScreen';

export default function App() {

  const [logged, isLogged] = useState(false);

  function onClickedButton(){
    isLogged(true);
  }

  return (
  
      <View style={styles.container}>
          {logged ? <ActivityScreen /> : <LoginScreen buttonDown={onClickedButton} />}
      </View>
 
  );
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
});

