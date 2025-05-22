import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions as RNDimensions } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

// Wymiary wykresu
const screenWidth = RNDimensions.get('window').width;

// Funkcja do obliczenia ostatnich 7 dni
const getLast7Days = () => {
  const days = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']; // Dni tygodnia
  const today = new Date();
  const last7Days = [];

  today.setDate(today.getDate()-1);

  // Oblicz daty ostatnich 7 dni
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i); // Ustaw datę na i-ty dzień wstecz
    last7Days.push(days[day.getDay()]); // Dodaj nazwę dnia tygodnia do tablicy
  }

  return last7Days;
};

// Generowanie etykiet dla ostatnich 7 dni
const labels = getLast7Days();

const chartConfig = {
  backgroundColor: '#304485',
  backgroundGradientFrom: '#304485',
  backgroundGradientTo: '#304485',
  decimalPlaces: 0, // Liczba miejsc po przecinku
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const ActivityScreen = ({navigation}) => {
  const [trainingsThisWeek, setTrainingsThisWeek] = useState(0);
  const [painLevel, setPainLevel] = useState('Low');
  const [progressRatio, setProgressRatio] = useState('Normal');
  const [consultations, setConsultations] = useState(0);
  const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;

      // Get trainings from the last 7 days
      const trainingsRef = collection(FIREBASE_DB, 'trainings');
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const q = query(
        trainingsRef,
        where('userId', '==', user.uid),
        where('date', '>=', Timestamp.fromDate(weekAgo))
      );
      
      const querySnapshot = await getDocs(q);
      const trainings = [];
      querySnapshot.forEach((doc) => {
        trainings.push(doc.data());
      });

      // Calculate trainings per day for the chart
      const dailyTrainings = new Array(7).fill(0);
      trainings.forEach(training => {
        const date = training.date.toDate();
        const dayIndex = 6 - Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < 7) {
          dailyTrainings[dayIndex]++;
        }
      });
      setChartData(dailyTrainings);

      // Set total trainings this week
      setTrainingsThisWeek(trainings.length);

      // Calculate average pain level based on training intensity
      const painLevels = trainings.map(t => {
        const intensity = t.intensity || 'low';
        switch(intensity.toLowerCase()) {
          case 'high':
            return 'Strong';
          case 'medium':
            return 'Medium';
          default:
            return 'Low';
        }
      });
      const painCounts = painLevels.reduce((acc, level) => {
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});
      const mostFrequentPain = Object.entries(painCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Low';
      setPainLevel(mostFrequentPain);

      // Calculate progress ratio based on training frequency
      const progress = trainings.length >= 20 ? 'Fast' : 
                      trainings.length >= 10 ? 'Normal' : 'Slow';
      setProgressRatio(progress);

      // Get consultations count
      const consultationsRef = collection(FIREBASE_DB, 'consultations');
      const consultationsQuery = query(
        consultationsRef,
        where('userId', '==', user.uid)
      );
      const consultationsSnapshot = await getDocs(consultationsQuery);
      setConsultations(consultationsSnapshot.size);

    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const data = {
    labels: labels,
    datasets: [
      {
        data: chartData,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Tytuł */}
      <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between',}}>
        <Text style={styles.title}>Statistics</Text>
        <Button title='back' color='#fff' onPress={()=>navigation.navigate('Main')}/>
      </View>
      
      {/* Wykres */}
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={screenWidth - 40}
          height={240}
          chartConfig={chartConfig}
          bezier
          style={{borderRadius:10,}}
        />
      </View>

      {/* Statystyki użytkownika */}
      <View style={styles.statsContainer}>
        <View style={styles.statText}>
          <Image style={styles.statImage} source={require('../assets/weightlifter.png')}/>
          <Text style={styles.statInnerText2}>{trainingsThisWeek}+</Text>
          <Text style={styles.statInnerText}>Trainings this week</Text>
        </View>

        <View style={styles.statText}>
          <Image style={styles.statImage} source={require('../assets/pain.png')}/>
          <Text style={styles.statInnerText2}>{painLevel}</Text>
          <Text style={styles.statInnerText}>Pain levels</Text>
        </View>

        <View style={styles.statText}>
          <Image style={styles.statImage} source={require('../assets/progress.png')}/>
          <Text style={styles.statInnerText2}>{progressRatio}</Text>
          <Text style={styles.statInnerText}>Progress ratio</Text>
        </View>

        <View style={styles.statText}>
          <Image style={styles.statImage} source={require('../assets/doctor.png')}/>
          <Text style={styles.statInnerText2}>{consultations}</Text>
          <Text style={styles.statInnerText}>Consultations</Text>
        </View>

        <View style={{width:'100%', backgroundColor:'#304485', flexDirection:'row', justifyContent:'space-around', padding:20, borderRadius:10,}}>
          <Text style={{color:'#fff', fontSize:20, fontWeight:'bold',}}>Share your progress</Text>
          <Image style={{width:30, height:30,}} source={require('../assets/share.png')}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor:'#5c9ae6',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#fff',
  },
  chartContainer: {
    marginBottom: 30, // odstęp między wykresem a statystykami
  },
  statsContainer: {
    justifyContent: 'space-between',
    flexWrap:'wrap',
    flexDirection:'row',
    marginTop: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  statText: {
    padding:20,
    width:175,
    height:150,
    backgroundColor:'#304485',
    borderRadius:10,
    marginBottom: 20,
    alignItems:'center',
    
  },
  statInnerText: {
    fontSize: 10,
    fontWeight:'300',
    color:'#fff',
    
  },
  statInnerText2: {
    fontSize: 20,
    fontWeight:'bold',
    color:'#fff',
    marginBottom:3,
  },
  statImage: {
    width:40,
    height:40,
    marginBottom:20,
  },
});

export default ActivityScreen;
