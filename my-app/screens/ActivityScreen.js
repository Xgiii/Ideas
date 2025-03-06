import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions as RNDimensions } from 'react-native';

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

const data = {
  labels: labels, // Ostatnie 7 dni
  datasets: [
    {
      data: [2, 4, 3, 5, 6, 2, 4], // Liczba treningów dla każdego dnia
      strokeWidth: 2, // Grubość linii
    },
  ],
};

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

const ActivityScreen = () => {
  return (
    <View style={styles.container}>
      {/* Tytuł */}
      <Text style={styles.title}>Statistics</Text>

      {/* Wykres */}
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={screenWidth - 40} // Szerokość wykresu
          height={240} // Wysokość wykresu
          chartConfig={chartConfig}
          bezier // Efekt wygładzania linii
          style={{borderRadius:10,}}
        />
      </View>

      {/* Statystyki użytkownika */}
      <View style={styles.statsContainer}>

        <View style={styles.statText}>
          <Image style={styles.statImage} source={require('../assets/weightlifter.png')}/><Text style={styles.statInnerText2}>20+</Text><Text style={styles.statInnerText}>Trainings this week</Text>
        </View>

        <View style={styles.statText}>
          <Image style={styles.statImage} source={require('../assets/pain.png')}/><Text style={styles.statInnerText2}>Medium</Text><Text style={styles.statInnerText}>Pain levels</Text>
        </View>

        <View style={styles.statText}>
          <Image style={styles.statImage} source={require('../assets/progress.png')}/><Text style={styles.statInnerText2}>Fast</Text><Text style={styles.statInnerText}>Progress ratio</Text>
        </View>

        <View style={styles.statText}>
          <Image style={styles.statImage} source={require('../assets/doctor.png')}/><Text style={styles.statInnerText2}>4</Text><Text style={styles.statInnerText}>Consultations</Text>
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
    width:'100%',
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
