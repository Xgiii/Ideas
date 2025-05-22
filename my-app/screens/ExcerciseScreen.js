import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Modal, Button, ScrollView, TextInput, Alert } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { FIREBASE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { collection, getDocs, addDoc, query, where, orderBy, Timestamp, doc, getDoc, setDoc } from 'firebase/firestore';

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

const ExerciseScreen = ({navigation, route}) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [lastTrainings, setLastTrainings] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseCount, setExerciseCount] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          loadExercises(),
          loadUserTrainings()
        ]);

        // Check if a plan was selected from PlansScreen
        if (route.params?.selectedPlan) {
          const plan = route.params.selectedPlan;
          // Convert plan exercises to training format
          const planExercises = plan.exercises.map(exercise => ({
            ...exercise,
            count: exercise.count || 0
          }));
          setTrainings(planExercises);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", "Failed to load exercises and training history");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [route.params?.selectedPlan]);

  const loadExercises = async () => {
    try {
      const exercisesRef = collection(FIREBASE_DB, 'exercises');
      const querySnapshot = await getDocs(exercisesRef);
      const loadedExercises = [];
      
      querySnapshot.forEach((doc) => {
        loadedExercises.push({ id: doc.id, ...doc.data() });
      });
      
      setExercises(loadedExercises);
    } catch (error) {
      console.error("Error loading exercises:", error);
      throw error;
    }
  };

  const loadUserTrainings = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.log("No user logged in");
        return;
      }

      const trainingsRef = collection(FIREBASE_DB, 'trainings');
      const q = query(
        trainingsRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const loadedTrainings = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedTrainings.push({ 
          id: doc.id, 
          ...data,
          displayDate: data.date ? new Date(data.date.toDate()).toLocaleString() : new Date().toLocaleString()
        });
      });
      
      setLastTrainings(loadedTrainings);
    } catch (error) {
      console.error("Error loading user trainings:", error);
      // If there's an index error, try loading without ordering
      if (error.code === 'failed-precondition') {
        try {
          const currentUser = FIREBASE_AUTH.currentUser;
          if (!currentUser) {
            console.log("No user logged in for fallback query");
            return;
          }

          const trainingsRef = collection(FIREBASE_DB, 'trainings');
          const q = query(
            trainingsRef,
            where('userId', '==', currentUser.uid)
          );
          
          const querySnapshot = await getDocs(q);
          const loadedTrainings = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            loadedTrainings.push({ 
              id: doc.id, 
              ...data,
              displayDate: data.date ? new Date(data.date.toDate()).toLocaleString() : new Date().toLocaleString()
            });
          });
          
          setLastTrainings(loadedTrainings);
        } catch (fallbackError) {
          console.error("Error loading trainings without ordering:", fallbackError);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
  };

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

  const saveTraining = async () => {
    if (trainings.length > 0) {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) {
          Alert.alert("Error", "You must be logged in to save trainings");
          return;
        }

        console.log("Saving training for user:", user.uid);

        const trainingsRef = collection(FIREBASE_DB, 'trainings');
        await addDoc(trainingsRef, {
          userId: user.uid,
          date: Timestamp.now(),
          exercises: trainings
        });

        // Update streak
        const userStreakRef = doc(FIREBASE_DB, 'userStreaks', user.uid);
        const userStreakDoc = await getDoc(userStreakRef);
        const now = new Date();
        
        console.log("Current streak document:", userStreakDoc.exists() ? userStreakDoc.data() : "No streak document");
        
        if (userStreakDoc.exists()) {
          const data = userStreakDoc.data();
          const lastActivity = data.lastActivityDate?.toDate();
          
          console.log("Last activity date:", lastActivity);
          
          if (!lastActivity) {
            console.log("No last activity, setting first streak");
            // First activity
            await setDoc(userStreakRef, {
              streak: 1,
              lastActivityDate: Timestamp.now()
            });
          } else {
            const hoursSinceLastActivity = (now - lastActivity) / (1000 * 60 * 60);
            console.log("Hours since last activity:", hoursSinceLastActivity);
            
            if (hoursSinceLastActivity > 48) {
              console.log("Reset streak - more than 48 hours passed");
              // Reset streak if more than 48 hours have passed
              await setDoc(userStreakRef, {
                streak: 1,
                lastActivityDate: Timestamp.now()
              });
            } else if (hoursSinceLastActivity >= 24) {
              console.log("Increment streak - 24-48 hours passed");
              // Increment streak if at least 24 hours have passed
              const newStreak = (data.streak || 0) + 1;
              await setDoc(userStreakRef, {
                streak: newStreak,
                lastActivityDate: Timestamp.now()
              });
            } else {
              console.log("No streak update - less than 24 hours passed");
            }
          }
        } else {
          console.log("No streak document, initializing first streak");
          // Initialize streak for new users
          await setDoc(userStreakRef, {
            streak: 1,
            lastActivityDate: Timestamp.now()
          });
        }

        // Update local state
        setLastTrainings([{ 
          date: Timestamp.now(),
          displayDate: new Date().toLocaleString(),
          exercises: trainings 
        }, ...lastTrainings]);
        setTrainings([]);

        // Reload trainings from Firestore
        await loadUserTrainings();
        
        // Show success message
        Alert.alert("Success", "Training saved successfully!");
      } catch (error) {
        console.error("Error saving training:", error);
        Alert.alert("Error", "Failed to save training");
      }
    }
  };

  const loadTrainingToToday = (training) => {
    // Convert the training exercises to the format needed for today's training
    const exercisesForToday = training.exercises.map(exercise => ({
      ...exercise,
      count: exercise.count || 0 // Ensure count exists
    }));
    setTrainings(exercisesForToday);
  };

  const removeExerciseFromTraining = (indexToRemove) => {
    setTrainings(trainings.filter((_, index) => index !== indexToRemove));
  };

  return (
    <View style={styles.container}>
      <View style={{width:'100%',flexDirection:'row', justifyContent:'space-between', marginVertical:50, alignItems:'center' }}>
        <Text style={styles.title}>Excercises</Text>
        <Button title='back' color='#fff' onPress={()=>navigation.navigate('Main')}/>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {exercises.map((item, index) => (
            <View key={item.id || index} style={styles.categoryContainer}>
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
              {trainings.length > 0 ? (
                trainings.map((training, index) => (
                  <View key={index} style={styles.trainingItem}>
                    <View style={styles.trainingItemContent}>
                      <View style={styles.trainingHeader}>
                        <Text style={styles.trainingExerciseText}>{training.name} - {training.count}x</Text>
                        <TouchableOpacity 
                          onPress={() => removeExerciseFromTraining(index)}
                          style={styles.deleteButton}
                        >
                          <AntDesign name="delete" size={20} color="#ff4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>No exercises added yet. Add some exercises to start your training!</Text>
                </View>
              )}
            </ScrollView>
            <Button title="Save Training" onPress={saveTraining} />
          </View>
          <View style={styles.lastTrainingsPanel}>
            <Text style={styles.panelTitle}>Last 3 Trainings</Text>
            <ScrollView>
              {lastTrainings.slice(0, 3).map((training, index) => (
                <TouchableOpacity 
                  key={training.id || index} 
                  style={styles.trainingItem}
                  onPress={() => loadTrainingToToday(training)}
                >
                  <View style={styles.trainingItemContent}>
                    <View style={styles.trainingHeader}>
                      <Text style={styles.trainingDate}>{training.displayDate}</Text>
                      <AntDesign name="reload1" size={20} color="#5c9ae6" />
                    </View>
                    {training.exercises.map((exercise, i) => (
                      <Text key={i} style={styles.trainingExerciseText}>
                        - {exercise.name} ({exercise.count}x)
                      </Text>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
              {lastTrainings.length === 0 && (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>No training history yet. Start your first training!</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      )}
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
  trainingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  trainingItemContent: {
    padding: 5,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  trainingDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  trainingExerciseText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginVertical: 2,
  },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: 300 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 5, marginVertical: 10 },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
  deleteButton: {
    padding: 5,
  },
});

export default ExerciseScreen;
