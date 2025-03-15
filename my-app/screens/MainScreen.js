import { StyleSheet, Text, View, TextInput, Button, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from "../FirebaseConfig";

export default function MainScreen({navigation}) {

    return (
        <View style={styles.container}>
        <View style={{flex:2, justifyContent:'center', width:'100%', alignItems:'center',}}>
          <Image source={require('../assets/profile.png')} style={{width:120,height:120,}} /> 
          <View>
            <Text style={{color:"#fff", fontWeight:700, fontSize:20, marginTop:15,}}>Mateusz Gawlewicz</Text>
            <Text style={{color:"#fff", fontWeight:300, fontSize:15,}}>Sanok, Poland</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', marginTop:20,}}>
            <Image source={require('../assets/fire.png')} style={{width:25,height:25,}}/>
            <Text style={{color:"#fff", fontWeight:700, fontSize:15, marginTop:5,marginLeft:5,}}>Longest Streak: 5 days!</Text>
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
            <ImageBackground source={require('../assets/plan.png')} style={{width:'100%', height:'100%', justifyContent:'space-around', alignItems:'center', flexDirection:'row',}} imageStyle={{ borderRadius:40, opacity:0.6,}}>
              <Text style={{color:'#fff', fontSize:25, fontWeight:600, textTransform:'uppercase',}}>plans                      </Text> 
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
