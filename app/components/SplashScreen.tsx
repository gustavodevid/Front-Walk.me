import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/entrar/entrar'); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.jpeg')} 
        style={styles.image}
        resizeMode="contain" 
      />
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color:'#fff',
    backgroundColor:'#fff'
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});