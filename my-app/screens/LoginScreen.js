import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;

  async function signIn() {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Sign in failed" + err.message);
    }
    setLoading(false);
  }

  async function signUp() {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Sign up failed" + err.message);
    }
    alert("Sign up successful!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "#fff",
          textTransform: "uppercase",
          fontSize: 50,
          fontWeight: "900",
        }}
      >
        rehab
      </Text>
      <Text
        style={{
          color: "#fff",
          textTransform: "uppercase",
          fontSize: 20,
          fontWeight: "300",
        }}
      >
        laboratory
      </Text>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
        }}
      >
        <TextInput
          placeholder='Email'
          autoCapitalize='none'
          style={{
            fontSize: 20,
            marginBottom: 15,
            borderColor: "#fff",
            borderWidth: 2,
            width: 200,
            textAlign: "center",
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 10,
            color: "#fff",
            marginTop: 40,
          }}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          placeholder='Password'
          secureTextEntry={true}
          style={{
            fontSize: 20,
            marginBottom: 15,
            borderColor: "#fff",
            borderWidth: 2,
            width: 200,
            textAlign: "center",
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 10,
            color: "#fff",
          }}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      {loading ? (
        <ActivityIndicator size='large' color='#fff' />
      ) : (
        <>
          <Button title='LOG IN' color='#55d' onPress={signIn} />
          <Button title='SIGN UP' color='#55d' onPress={signUp} />
        </>
      )}

      <View style={{ width: 300, marginTop: 100 }}>
        <Text style={{ color: "#fff", fontSize: 15, fontWeight: "300" }}>
          “Our greatest glory is not in never falling, but in rising up every
          time we fail.” – Ralph Waldo Emerson.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5c9ae6",
    alignItems: "center",
    justifyContent: "center",
  },
});
