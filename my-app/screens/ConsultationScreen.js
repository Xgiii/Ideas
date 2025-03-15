import React from "react";
import { View, Button, Text, FlatList, TouchableOpacity, Linking, StyleSheet, Image } from "react-native";

// Przykładowe dane z URL zdjęcia i oceną użytkowników
const images = {
  "doc1.jpg": require('../assets/doc1.jpg'),
  "doc2.jpg": require('../assets/doc2.jpg'),
  "doc3.jpg": require('../assets/doc3.jpg'),
  "doc4.jpg": require('../assets/doc4.jpg'),
  "doc5.png": require('../assets/doc5.png'),
};

const doctors = [
  { id: "1", name: "Dr. John Smith", specialty: "Cardiologist", meetLink: "https://meet.google.com/abc-defg-hij", image: 'doc1.jpg', rating: 4.5 },
  { id: "2", name: "Dr. Ignes Solar", specialty: "Neurologist", meetLink: "https://meet.google.com/xyz-1234-567", image: 'doc2.jpg', rating: 4.7 },
  { id: "3", name: "Dr. Tomasz Nowak", specialty: "Practitioner", meetLink: "https://meet.google.com/uvw-6789-xyz", image: 'doc3.jpg', rating: 4.3 },
  { id: "4", name: "Dr. Maurice Pena", specialty: "Practitioner", meetLink: "https://meet.google.com/uvw-6789-xyz", image: 'doc4.jpg', rating: 4.3 },
  { id: "5", name: "Dr. Diogo Costa", specialty: "Suregon", meetLink: "https://meet.google.com/uvw-6789-xyz", image: 'doc5.png', rating: 4.3 },
];

const DoctorListScreen = ({navigation}) => {
  const handleJoinMeeting = (meetLink) => {
    Linking.openURL(meetLink);
  };

  return (
    <View style={styles.container}>
      <View style={{width:'100%',flexDirection:'row', justifyContent:'space-between', marginVertical:50, alignItems:'center' }}>
        <Text style={styles.title}>Available specialists</Text>
        <Button title='back' color='#fff' onPress={()=>navigation.navigate('Main')}/>
      </View>
      
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={images[item.image]} style={styles.image} />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.specialty}>{item.specialty}</Text>
              <Text style={styles.rating}>Rating: {item.rating} / 5</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleJoinMeeting(item.meetLink)}>
              <Text style={styles.buttonText}>Set Meeting</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#5c9ae6" },
  title: { fontSize: 30, fontWeight: "bold", textAlign: "center", color:'#fff', },
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 10, elevation: 3, flexDirection: "row", alignItems: "center" },
  imageContainer: { marginRight: 15 },
  image: { width: 50, height: 50, borderRadius: 25 },
  infoContainer: { flex: 1 },
  name: { fontSize: 18, fontWeight: "bold" },
  specialty: { fontSize: 16, color: "gray", marginBottom: 5 },
  rating: { fontSize: 14, color: "#f1c40f", marginBottom: 10 },
  button: { backgroundColor: "#1db372", padding: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default DoctorListScreen;
