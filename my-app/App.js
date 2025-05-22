import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import ActivityScreen from "./screens/ActivityScreen";
import ConsultationScreen from "./screens/ConsultationScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import PlansScreen from "./screens/PlansScreen";
import ExerciseScreen from "./screens/ExcerciseScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUser(user);
        setUserName(user.displayName || user.email);
      } else {
        setUser(null);
        setUserName("");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="Main" 
            component={MainScreen} 
            initialParams={{ userName: userName }}
          />
          <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
          <Stack.Screen name="ExcerciseScreen" component={ExerciseScreen} />
          <Stack.Screen name="PlansScreen" component={PlansScreen} />
          <Stack.Screen name="ConsultationsScreen" component={ConsultationScreen} />
        </Stack.Navigator>
      ) : (
        <LoginScreen />
      )}
    </NavigationContainer>
  );
}

