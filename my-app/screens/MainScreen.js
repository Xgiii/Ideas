import { StyleSheet, Text, View, TextInput, Button, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

export default function MainScreen({navigation}) {
    const [user, setUser] = useState(null);
    const [streak, setStreak] = useState(0);
    const [lastActivityDate, setLastActivityDate] = useState(null);

    useEffect(() => {
        const currentUser = FIREBASE_AUTH.currentUser;
        setUser(currentUser);
        if (currentUser) {
            fetchUserStreak(currentUser.uid);
        }
    }, []);

    const fetchUserStreak = async (userId) => {
        try {
            console.log("Fetching streak for user:", userId);
            const userDoc = await getDoc(doc(FIREBASE_DB, 'userStreaks', userId));
            console.log("Streak document exists:", userDoc.exists());
            
            if (userDoc.exists()) {
                const data = userDoc.data();
                console.log("Streak data:", data);
                setStreak(data.streak || 0);
                setLastActivityDate(data.lastActivityDate?.toDate());
            } else {
                console.log("No streak document found, initializing...");
                // Initialize streak data for new users
                await setDoc(doc(FIREBASE_DB, 'userStreaks', userId), {
                    streak: 0,
                    lastActivityDate: Timestamp.now()
                });
                setStreak(0);
                setLastActivityDate(new Date());
            }
        } catch (error) {
            console.error("Error fetching streak:", error);
        }
    };

    // Add a refresh function that can be called when returning to this screen
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (user) {
                fetchUserStreak(user.uid);
            }
        });

        return unsubscribe;
    }, [navigation, user]);

    const updateStreak = async (userId) => {
        try {
            const now = new Date();
            const lastActivity = lastActivityDate ? new Date(lastActivityDate) : null;
            
            if (!lastActivity) {
                // First activity
                await setDoc(doc(FIREBASE_DB, 'userStreaks', userId), {
                    streak: 1,
                    lastActivityDate: Timestamp.now()
                });
                setStreak(1);
                setLastActivityDate(now);
                return;
            }

            const hoursSinceLastActivity = (now - lastActivity) / (1000 * 60 * 60);
            
            if (hoursSinceLastActivity > 48) {
                // Reset streak if more than 48 hours have passed
                await setDoc(doc(FIREBASE_DB, 'userStreaks', userId), {
                    streak: 1,
                    lastActivityDate: Timestamp.now()
                });
                setStreak(1);
                setLastActivityDate(now);
            } else if (hoursSinceLastActivity >= 24) {
                // Increment streak if at least 24 hours have passed
                const newStreak = streak + 1;
                await setDoc(doc(FIREBASE_DB, 'userStreaks', userId), {
                    streak: newStreak,
                    lastActivityDate: Timestamp.now()
                });
                setStreak(newStreak);
                setLastActivityDate(now);
            }
        } catch (error) {
            console.error("Error updating streak:", error);
        }
    };

    return (
        <View style={styles.container}>
        <View style={{flex:2, justifyContent:'center', width:'100%', alignItems:'center',}}>
          <Image source={require('../assets/profile.png')} style={{width:120,height:120,}} /> 
          <View>
            <Text style={{color:"#fff", fontWeight:700, fontSize:20, marginTop:15,}}>
              {user?.email || 'User'}
            </Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', marginTop:20,}}>
            <Image source={require('../assets/fire.png')} style={{width:25,height:25,}}/>
            <Text style={{color:"#fff", fontWeight:700, fontSize:15, marginTop:5,marginLeft:5,}}>Current Streak: {streak} days!</Text>
          </View>
        </View>
        <View style={{flex:3, gap:20, alignItems:'center', width:'100%'}}>

      <TouchableOpacity onPress={()=> navigation.navigate("ExcerciseScreen")} style={{width:'90%', height:80, backgroundColor:'#000', borderRadius:40,}}>
         <View style={{ borderRadius:40,}}>
            <ImageBackground source={require('../assets/gym.jpeg')} style={{width:'100%', height:'100%', justifyContent:'space-around', alignItems:'center', flexDirection:'row',}} imageStyle={{ borderRadius:40, opacity:0.6,}}>
              <Text style={{color:'#fff', fontSize:25, fontWeight:600, textTransform:'uppercase',}}>excercises         </Text> 
              <Image source={require('../assets/arrow-right.png')} style={{width:30, height:30,}}/>
            </ImageBackground>
          </View>
       </TouchableOpacity> 

      <TouchableOpacity onPress={()=> navigation.navigate("ActivityScreen")} style={{width:'90%', height:80, backgroundColor:'#000', borderRadius:40,}}>
        <View style={{borderRadius:40,}}>
            <ImageBackground source={require('../assets/active.png')} style={{width:'100%', height:'100%', justifyContent:'space-around', alignItems:'center', flexDirection:'row',}} imageStyle={{ borderRadius:40, opacity:0.6,}}>
              <Text style={{color:'#fff', fontSize:25, fontWeight:600, textTransform:'uppercase',}}>activity                 </Text> 
              <Image source={require('../assets/arrow-right.png')} style={{width:30, height:30,}}/>
            </ImageBackground>
          </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> navigation.navigate("PlansScreen")} style={{width:'90%', height:80, backgroundColor:'#000', borderRadius:40,}}>
          <View style={{borderRadius:40,}}>
            <ImageBackground source={require('../assets/gym.jpeg')} style={{width:'100%', height:'100%', justifyContent:'space-around', alignItems:'center', flexDirection:'row',}} imageStyle={{ borderRadius:40, opacity:0.6,}}>
              <Text style={{color:'#fff', fontSize:25, fontWeight:600, textTransform:'uppercase',}}>workout plans</Text> 
              <Image source={require('../assets/arrow-right.png')} style={{width:30, height:30,}}/>
            </ImageBackground>
          </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> navigation.navigate("ConsultationsScreen")} style={{width:'90%', height:80, backgroundColor:'#000', borderRadius:40,}}>
          <View style={{borderRadius:40,}}>
            <ImageBackground source={require('../assets/cons.png')} style={{width:'100%', height:'100%', justifyContent:'space-around', alignItems:'center', flexDirection:'row',}} imageStyle={{ borderRadius:40, opacity:0.6,}}>
              <Text style={{color:'#fff', fontSize:25, fontWeight:600, textTransform:'uppercase',}}>consultations</Text> 
              <Image source={require('../assets/arrow-right.png')} style={{width:30, height:30,}}/>
            </ImageBackground>
          </View>
      </TouchableOpacity>

      <Button
          title='SIGN OUT'
          color='#55d'
          onPress={() => FIREBASE_AUTH.signOut()}
        />

          </View>

</View>  
)};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5c9ae6",
    alignItems: "center",
    justifyContent: "center",
  },
});
