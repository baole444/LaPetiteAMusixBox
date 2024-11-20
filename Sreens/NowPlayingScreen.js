import '../gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Dimensions  } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For heart, play, pause, shuffle, repeat, etc.
import { colors } from '../Server/constants';
import * as SplashScreen from 'expo-splash-screen';
import PlayerScreen from './playerAllscr';
import Image_reload from '../Image_reload';

SplashScreen.preventAutoHideAsync();

function NowPlayingScreen({ navigation }) {
    useEffect(() => {
      navigation.setOptions({
        headerTitle: 'Enjoy!',
        headerStyle: {
          backgroundColor: colors.primary,
        }
      });
    }, [navigation]);
  
    return (
      <View style={styles.container}>
        <View style={styles.albumContainer}>
          <Image_reload
            source={require('../assets/texture/loop.png')}
          />
          <Text style={styles.nextSongsTitle}>Thumbnail comming soon(tm)</Text>
        </View>
  
        <PlayerScreen/>
  
        {/* Next Songs */}
        <Text style={styles.nextSongsTitle}>Next songs:</Text>
        <ScrollView horizontal contentContainerStyle={styles.nextSongsContainer}>
          <View style={styles.songCard}>
            <Text style={styles.songCardTitle}>I Don’t Want to See Tomorrow</Text>
            <Text style={styles.songCardArtist}>Nat King Cole</Text>
            <FontAwesome name="times" size={24} color="black" style={styles.removeIcon} />
          </View>
  
          {/* Add more song cards here */}
          <View style={styles.songCardEmpty} />
          <View style={styles.songCardEmpty} />
        </ScrollView>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    albumContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    albumArt: {
      width: 200,
      height: 200,
      borderRadius: 10,
      marginBottom: 10,
    },
    songTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    artistName: {
      fontSize: 16,
      color: 'gray',
      textAlign: 'center',
      marginBottom: 10,
    },
    heartIcon: {
      marginLeft: 10,
    },
    controlsContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    progressBar: {
      width: '80%',
      height: 5,
      backgroundColor: 'gray',
      borderRadius: 2,
      marginBottom: 15,
      overflow: 'hidden',
    },
    progressFill: {
      width: '40%',
      height: '100%',
      backgroundColor: '#FBCB3C',
    },
    controlButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '60%',
    },
    nextSongsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      textAlign: 'center',
    },
    nextSongsContainer: {
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'center',
    },
    songCard: {
      width: 120,
      padding: 10,
      height: 270,
      marginRight: 10,
      backgroundColor: '#FBCB3C',
      borderRadius: 10,
      alignItems: 'center',
    },
    songCardImage: {
      width: 80,
      height: 80,
      borderRadius: 5,
      marginBottom: 5,
    },
    songCardTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    songCardArtist: {
      fontSize: 12,
      color: 'gray',
      textAlign: 'center',
    },
    songCardEmpty: {
      width: 120,
      height: 270,
      marginRight: 10,
      backgroundColor: '#FBCB3C',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
export default NowPlayingScreen;
