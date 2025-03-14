import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import ActivityScreen from "./screens/ActivityScreen";
import ConsultationScreen from "./screens/ConsultationScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";

const Stack = createNativeStackNavigator();


export default function App() {

  const [user, setUser] = useState(null);
  console.log(user);
  

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUser(user);
      }
    })
  }, [user])

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
          <Stack.Screen name="ExcercisesScreen" component={ActivityScreen} />
          <Stack.Screen name="PlansScreen" component={ActivityScreen} />
          <Stack.Screen name="ConsultationsScreen" component={ConsultationScreen} />

        </Stack.Navigator>
      ) : (
        <LoginScreen />
      )}
    </NavigationContainer>
  );
}

