import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Button } from "react-native";
import { FIREBASE_DB, FIREBASE_AUTH } from "../FirebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

export default function PlansScreen({ navigation }) {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            setIsLoading(true);
            const plansRef = collection(FIREBASE_DB, 'workoutPlans');
            const querySnapshot = await getDocs(plansRef);
            
            if (querySnapshot.empty) {
                // If no plans exist, create default plans
                await createDefaultPlans();
                // Reload plans after creation
                const newQuerySnapshot = await getDocs(plansRef);
                const loadedPlans = [];
                newQuerySnapshot.forEach((doc) => {
                    loadedPlans.push({ id: doc.id, ...doc.data() });
                });
                setPlans(loadedPlans);
            } else {
                const loadedPlans = [];
                querySnapshot.forEach((doc) => {
                    loadedPlans.push({ id: doc.id, ...doc.data() });
                });
                setPlans(loadedPlans);
            }
        } catch (error) {
            console.error("Error loading plans:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const createDefaultPlans = async () => {
        const defaultPlans = [
            {
                name: "3x Weekly Plan",
                frequency: 3,
                description: "Perfect for beginners or those with busy schedules",
                exercises: [
                    { name: "Shoulder Rolls", count: 10, sets: 3 },
                    { name: "Arm Circles", count: 15, sets: 3 },
                    { name: "Seated Knee Extensions", count: 12, sets: 3 },
                    { name: "Cat-Cow Stretch", count: 10, sets: 3 }
                ],
                image: require('../assets/gym.jpeg')
            },
            {
                name: "4x Weekly Plan",
                frequency: 4,
                description: "Balanced plan for consistent progress",
                exercises: [
                    { name: "Shoulder Rolls", count: 12, sets: 3 },
                    { name: "Arm Circles", count: 15, sets: 3 },
                    { name: "Resistance Band Pulls", count: 10, sets: 3 },
                    { name: "Seated Knee Extensions", count: 12, sets: 3 },
                    { name: "Step-ups", count: 10, sets: 3 },
                    { name: "Cat-Cow Stretch", count: 10, sets: 3 }
                ],
                image: require('../assets/gym.jpeg')
            },
            {
                name: "5x Weekly Plan",
                frequency: 5,
                description: "Intensive plan for maximum results",
                exercises: [
                    { name: "Shoulder Rolls", count: 15, sets: 3 },
                    { name: "Arm Circles", count: 15, sets: 3 },
                    { name: "Resistance Band Pulls", count: 12, sets: 3 },
                    { name: "Seated Knee Extensions", count: 15, sets: 3 },
                    { name: "Step-ups", count: 12, sets: 3 },
                    { name: "Lunges", count: 10, sets: 3 },
                    { name: "Cat-Cow Stretch", count: 12, sets: 3 },
                    { name: "Superman Exercise", count: 10, sets: 3 }
                ],
                image: require('../assets/gym.jpeg')
            }
        ];

        const plansRef = collection(FIREBASE_DB, 'workoutPlans');
        for (const plan of defaultPlans) {
            await addDoc(plansRef, plan);
        }
    };

    const selectPlan = (plan) => {
        // Navigate to exercise screen with selected plan
        navigation.navigate('ExcerciseScreen', { selectedPlan: plan });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Workout Plans</Text>
                <Button title='back' color='#fff' onPress={() => navigation.navigate('Main')} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading plans...</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    {plans.map((plan) => (
                        <TouchableOpacity
                            key={plan.id}
                            style={styles.planCard}
                            onPress={() => selectPlan(plan)}
                        >
                            <ImageBackground
                                source={plan.image}
                                style={styles.planBackground}
                                imageStyle={styles.planBackgroundImage}
                            >
                                <View style={styles.planContent}>
                                    <Text style={styles.planName}>{plan.name}</Text>
                                    <Text style={styles.planDescription}>{plan.description}</Text>
                                    <View style={styles.planDetails}>
                                        <Text style={styles.planFrequency}>{plan.frequency}x per week</Text>
                                        <Text style={styles.exerciseCount}>{plan.exercises.length} exercises</Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5c9ae6',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 50,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    planCard: {
        height: 200,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    planBackground: {
        width: '100%',
        height: '100%',
    },
    planBackgroundImage: {
        opacity: 0.7,
    },
    planContent: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
    },
    planName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    planDescription: {
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
    },
    planDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    planFrequency: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    exerciseCount: {
        fontSize: 16,
        color: '#fff',
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
});