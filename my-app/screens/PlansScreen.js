import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Modal, Button, ScrollView, TextInput } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';

export default function PlansScreen({navigation}){
    
    const plans = [
        {name: 'Daily Streching', count:16, time:12, times:5,},
        {name: 'Shoulder Mobility', count:5, time:25, times:1,},
    ]

    return(
        <View style={styles.container}>
            <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:40,}}>
                <Text style={styles.title}>Plans</Text>
                <Button title='back' color='#fff' onPress={()=>navigation.navigate('Main')}/>
            </View>
        {plans.map((item,index)=>(
            <View key={index} style={styles.tile}>
                <View style={styles.left}></View>
                <View style={styles.right}></View>
            </View>
        ))}
    
        </View>
    );
};

const styles = StyleSheet.create({
    container:{ flex:1, backgroundColor:'#5c9ae6', padding:20, },
    title: { fontSize: 30, fontWeight: "bold", textAlign: "center", color:'#fff', },
    tile:{backgroundColor:'#ff3144', padding:5, flexDirection:'row', justifyContent:'space-between', width:'100%', height:150, marginTop:10,},
    left: {backgroundColor:'#3e4fd1', flex:1},
    right: {backgroundColor:'#4cf1d1', flex:1}

})