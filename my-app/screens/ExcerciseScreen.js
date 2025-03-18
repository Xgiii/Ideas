import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Modal, Button, ScrollView, TextInput } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';

// Sample static data
const exercises = [
  {
    category: "Shoulder",
    image: require("../assets/shoulder.jpg"),
    exercises: [
      { name: "Shoulder Rolls", difficulty: "Easy", description: "Roll your shoulders forward and backward slowly.", completed: false },
      { name: "Arm Circles", difficulty: "Medium", description: "Make large circles with your arms extended.", completed: false },
      { name: "Resistance Band Pulls", difficulty: "Hard", description: "Use a resistance band to strengthen shoulder muscles.", completed: false },
    ],
  },
  {
    category: "Knee",
    image: require("../assets/knee.jpg"),
    exercises: [
      { name: "Seated Knee Extensions", difficulty: "Easy", description: "Extend your knee while sitting to strengthen your quads.", completed: false },
      { name: "Step-ups", difficulty: "Medium", description: "Step up onto a platform with alternating legs.", completed: false },
      { name: "Lunges", difficulty: "Hard", description: "Perform lunges to improve knee stability and strength.", completed: false },
    ],
  },
  {
    category: "Back",
    image: require("../assets/back.jpg"),
    exercises: [
      { name: "Cat-Cow Stretch", difficulty: "Easy", description: "Alternate between arching and rounding your back.", completed: false },
      { name: "Superman Exercise", difficulty: "Medium", description: "Lift your arms and legs off the floor while lying on your stomach.", completed: false },
      { name: "Deadlifts", difficulty: "Hard", description: "Perform deadlifts with proper form to strengthen your lower back.", completed: false },
    ],
  },
  {
    category: "Ankle",
    image: require("../assets/ankle.jpg"),
    exercises: [
      { name: "Ankle Circles", difficulty: "Easy", description: "Rotate your ankle in circular motions.", completed: false },
      { name: "Heel Raises", difficulty: "Medium", description: "Lift your heels off the ground while standing.", completed: false },
      { name: "Single-Leg Balance", difficulty: "Hard", description: "Stand on one foot to improve ankle stability.", completed: false },
    ],
  },
];

const difficultyColors = {
  "Easy": "#4caf50",
  "Medium": "#ffeb3b",
  "Hard": "#f44336",
};

const ExerciseScreen = ({navigation}) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [lastTrainings, setLastTrainings] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseCount, setExerciseCount] = useState("");
  

  const toggleExpand = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };


  const openExerciseModal = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseCount("");
  };

  const addExerciseToTraining = () => {
    if (selectedExercise && exerciseCount) {
      setTrainings([...trainings, { ...selectedExercise, count: parseInt(exerciseCount) }]);
      selectedExercise.completed = true;
      setSelectedExercise(null);
    }
  };

  const saveTraining = () => {
    if (trainings.length > 0) {
      setLastTrainings([{ date: new Date().toLocaleString(), exercises: trainings }, ...lastTrainings]);
      setTrainings([]);
    }
  };


  return (
    <View style={styles.container}>
      <View style={{width:'100%',flexDirection:'row', justifyContent:'space-between', marginVertical:50, alignItems:'center' }}>
              <Text style={styles.title}>Excercises</Text>
              <Button title='back' color='#fff' onPress={()=>navigation.navigate('Main')}/>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
        {exercises.map((item, index) => (
          <View key={index} style={styles.categoryContainer}>
            <TouchableOpacity onPress={() => toggleExpand(item.category)} style={styles.tile}>
              <Image source={item.image} style={styles.backgroundImage} />
              <Text style={styles.categoryTitle}>{item.category}</Text>
              <AntDesign name={expandedCategory === item.category ? "up" : "right"} size={24} color="black" style={styles.arrow} />
            </TouchableOpacity>
            {expandedCategory === item.category && (
              <View style={styles.exerciseList}>
                {item.exercises.map((exercise, index) => (
                  <TouchableOpacity key={index} style={styles.exerciseItem} onPress={() => openExerciseModal(exercise)}>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseText}>{exercise.name}</Text>
                      {exercise.completed && <AntDesign name="checkcircle" size={20} color="green" style={styles.completedIcon} />}
                    </View>
                    <ProgressBar progress={exercise.difficulty === "Easy" ? 0.3 : exercise.difficulty === "Medium" ? 0.6 : 1.0} color={difficultyColors[exercise.difficulty]} style={styles.progressBar} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
        <View style={styles.trainingPanel}>
          <Text style={styles.panelTitle}>Today's Trainings</Text>
          <ScrollView>
            {trainings.map((training, index) => (
              <View key={index} style={styles.trainingItem}>
                <Text>{training.name} - {training.count}x</Text>
              </View>
            ))}
          </ScrollView>
          <Button title="New Training" onPress={saveTraining} />
        </View>
        <View style={styles.lastTrainingsPanel}>
          <Text style={styles.panelTitle}>Last Trainings</Text>
          <ScrollView>
            {lastTrainings.map((training, index) => (
              <View key={index} style={styles.trainingItem}>
                <Text>{training.date}</Text>
                {training.exercises.map((exercise, i) => (
                  <Text key={i}>- {exercise.name} ({exercise.count}x)</Text>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <Modal visible={!!selectedExercise} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedExercise && (
              <>
                <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                <Text>{selectedExercise.description}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter count"
                  value={exerciseCount}
                  onChangeText={setExerciseCount}
                />
                <Button title="Add" onPress={addExerciseToTraining} />
                <Button title="Close" onPress={() => setSelectedExercise(null)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#5c9ae6",
  },
  categoryContainer: {
    marginBottom: 15,
  },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  backgroundImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  arrow: {
    position: "absolute",
    right: 15,
  },
  exerciseList: {
    marginTop: 10,
    paddingLeft: 20,
  },
  exerciseItem: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  exerciseInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  exerciseText: {
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 5,
  },
  completedIcon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: { fontSize: 30, fontWeight: "bold", textAlign: "center", color:'#fff', },
  scrollContainer: { paddingBottom: 20 },
  trainingPanel: { backgroundColor: "#ffffff", padding: 15, borderTopWidth: 1, borderColor: "#ddd", marginTop: 10 },
  lastTrainingsPanel: { backgroundColor: "#ffffff", padding: 15, borderTopWidth: 1, borderColor: "#ddd", marginTop: 10 },
  panelTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  trainingItem: { padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: 300 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 5, marginVertical: 10 },
});

export default ExerciseScreen;
