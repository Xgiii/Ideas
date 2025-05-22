import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Button, Alert, TextInput } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { FIREBASE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { collection, getDocs, addDoc, query, where, orderBy, Timestamp, doc, getDoc, setDoc } from 'firebase/firestore';

// Exercise List Component
const ExerciseList = ({ exercises, expandedCategory, toggleExpand, openExerciseModal }) => {
  const getImageSource = (imageNumber) => {
    // Map numbers to specific images
    const imageMap = {
      1: require('../assets/ankle.jpg'),
      2: require('../assets/shoulder.jpg'),
      3: require('../assets/back.jpg'),
      4: require('../assets/knee.jpg'),
    };
    
    return imageMap[imageNumber] || require('../assets/gym.jpeg'); // Default to gym image if number not found
  };

  console.log(exercises);
  

  return (
    <>
      {exercises.map((item, index) => (
        <View key={item.id || index} style={styles.categoryContainer}>
          <TouchableOpacity onPress={() => toggleExpand(item.category)} style={styles.tile}>
            <Image source={getImageSource(item.image)} style={styles.backgroundImage} />
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
    </>
  );
};

// Training Panel Component
const TrainingPanel = ({ trainings, removeExerciseFromTraining, showExerciseDetails, saveTraining }) => {
  return (
    <View style={styles.trainingPanel}>
      <Text style={styles.panelTitle}>Today's Trainings</Text>
      <ScrollView>
        {trainings.length > 0 ? (
          trainings.map((training, index) => (
            <View key={index} style={styles.trainingItem}>
              <View style={styles.trainingItemContent}>
                <View style={styles.trainingHeader}>
                  <TouchableOpacity 
                    onPress={() => showExerciseDetails(training)}
                    style={styles.exerciseNameContainer}
                  >
                    <Text style={styles.trainingExerciseText}>{training.name} - {training.count}x</Text>
                  </TouchableOpacity>
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
  );
};

// Last Trainings Panel Component
const LastTrainingsPanel = ({ lastTrainings, loadTrainingToToday }) => {
  return (
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
  );
};

// Exercise Details Modal Component
const ExerciseDetailsModal = ({ selectedExerciseDetails, onClose }) => {
  if (!selectedExerciseDetails) return null;
  
  return (
    <Modal visible={!!selectedExerciseDetails} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedExerciseDetails.name}</Text>
          <Text style={styles.exerciseDescription}>
            {selectedExerciseDetails.description || 'No description available'}
          </Text>
          <Text style={styles.exerciseDifficulty}>
            Difficulty: {selectedExerciseDetails.difficulty || 'Medium'}
          </Text>
          <Text style={styles.exerciseCount}>
            Count: {selectedExerciseDetails.count || 0}x
          </Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

// Add Exercise Modal Component
const AddExerciseModal = ({ selectedExercise, exerciseCount, setExerciseCount, addExerciseToTraining, onClose }) => {
  if (!selectedExercise) return null;

  return (
    <Modal visible={!!selectedExercise} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
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
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

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
  const [selectedExerciseDetails, setSelectedExerciseDetails] = useState(null);

  console.log(selectedExerciseDetails);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await loadExercises();
        await loadUserTrainings();

        // Check if a plan was selected from PlansScreen
        if (route.params?.selectedPlan) {
          console.log("Selected plan:", route.params.selectedPlan);
          console.log("Available exercises:", exercises);
          
          const plan = route.params.selectedPlan;
          // Convert plan exercises to training format with full details
          const planExercises = plan.exercises.map(exercise => {
            // Find the full exercise details from our loaded exercises
            const fullExercise = exercises.find(e => e.name === exercise.name);
            console.log("Matching exercise:", fullExercise, "for plan exercise:", exercise);
            
            if (!fullExercise) {
              console.log("No matching exercise found for:", exercise.name);
            }
            
            return {
            ...exercise,
              count: exercise.count || 0,
              description: fullExercise?.description || 'No description available',
              difficulty: fullExercise?.difficulty || 'Medium'
            };
          });
          console.log("Processed plan exercises:", planExercises);
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

  // Separate useEffect to handle plan exercises when exercises are loaded
  useEffect(() => {
    if (route.params?.selectedPlan && exercises.length > 0) {
      const plan = route.params.selectedPlan;
      const planExercises = plan.exercises.map(exercise => {
        const fullExercise = exercises.find(e => e.name === exercise.name);
        return {
          ...exercise,
          count: exercise.count || 0,
          description: fullExercise?.description || 'No description available',
          difficulty: fullExercise?.difficulty || 'Medium'
        };
      });
      setTrainings(planExercises);
    }
  }, [exercises, route.params?.selectedPlan]);

  const loadExercises = async () => {
    try {
      const exercisesRef = collection(FIREBASE_DB, 'exercises');
      const querySnapshot = await getDocs(exercisesRef);
      const loadedExercises = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Loading exercise from DB:", data);
        loadedExercises.push({ 
          id: doc.id, 
          ...data,
          exercises: data.exercises || []
        });
      });
      
      console.log("All loaded exercises:", loadedExercises);
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
      const exerciseToAdd = {
        ...selectedExercise,
        count: parseInt(exerciseCount),
        description: selectedExercise.description || 'No description available',
        difficulty: selectedExercise.difficulty || 'Medium'
      };
      setTrainings([...trainings, exerciseToAdd]);
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
      count: exercise.count || 0, // Ensure count exists
      description: exercise.description || 'No description available',
      difficulty: exercise.difficulty || 'Medium'
    }));
    setTrainings(exercisesForToday);
  };

  const removeExerciseFromTraining = (indexToRemove) => {
    setTrainings(trainings.filter((_, index) => index !== indexToRemove));
  };

  const showExerciseDetails = (exercise) => {
    console.log("Showing details for exercise:", exercise);
    console.log("Available exercises:", exercises);
    
    // Find the full exercise details from the exercises array
    const fullExercise = exercises.find(e => e.name === exercise.name);
    console.log("Found full exercise:", fullExercise);
    
    if (fullExercise) {
      setSelectedExerciseDetails({
        ...exercise,
        description: fullExercise.description,
        difficulty: fullExercise.difficulty
      });
    } else {
      // If we can't find the full exercise, try to find it in the original exercises array
      const originalExercise = exercises.find(e => 
        e.exercises && e.exercises.some(ex => ex.name === exercise.name)
      );
      
      if (originalExercise) {
        const matchingExercise = originalExercise.exercises.find(ex => ex.name === exercise.name);
        setSelectedExerciseDetails({
          ...exercise,
          description: matchingExercise.description,
          difficulty: matchingExercise.difficulty
        });
      } else {
        setSelectedExerciseDetails(exercise);
      }
    }
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
          <ExerciseList 
            exercises={exercises}
            expandedCategory={expandedCategory}
            toggleExpand={toggleExpand}
            openExerciseModal={openExerciseModal}
          />
          
          <TrainingPanel 
            trainings={trainings}
            removeExerciseFromTraining={removeExerciseFromTraining}
            showExerciseDetails={showExerciseDetails}
            saveTraining={saveTraining}
          />
          
          <LastTrainingsPanel 
            lastTrainings={lastTrainings}
            loadTrainingToToday={loadTrainingToToday}
          />
        </ScrollView>
      )}

      <ExerciseDetailsModal 
        selectedExerciseDetails={selectedExerciseDetails}
        onClose={() => setSelectedExerciseDetails(null)}
      />

      <AddExerciseModal 
        selectedExercise={selectedExercise}
        exerciseCount={exerciseCount}
        setExerciseCount={setExerciseCount}
        addExerciseToTraining={addExerciseToTraining}
        onClose={() => setSelectedExercise(null)}
      />
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
    paddingLeft: 0,
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
  exerciseNameContainer: {
    flex: 1,
  },
  exerciseDescription: {
    fontSize: 16,
    marginVertical: 10,
    color: '#333',
    lineHeight: 22,
  },
  exerciseDifficulty: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 10,
  },
  exerciseCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 15,
  },
});

export default ExerciseScreen;
