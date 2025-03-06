import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function LoginScreen({ buttonDown }) {
    return (
        <View style={styles.container}>
        <Text style={{color:'#fff', textTransform:'uppercase', fontSize:50, fontWeight:'900',}}>rehab</Text>
        <Text style={{color:'#fff', textTransform:'uppercase', fontSize:20, fontWeight:'300',}}>laboratory</Text>
        <TextInput placeholder="USER ID" style={{fontSize:20,marginBottom:15, borderColor:'#fff', borderWidth:2, width:200, textAlign:'center', borderRadius:25, paddingHorizontal: 15,paddingVertical:10,color:'#fff', marginTop:40,}}/>
        <Button title='LOG IN' color='#55d' onPress={buttonDown} />
        <View style={{width:300,  marginTop:100,}}>
        <Text style={{color:'#fff', fontSize:15,fontWeight:'300',}}>
        “Our greatest glory is not in never falling, but in rising up every time we fail.” – Ralph Waldo Emerson.
        </Text>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5c9ae6',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  


