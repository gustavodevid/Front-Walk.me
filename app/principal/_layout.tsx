import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import React, { useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';

function TabButton({ onPress, icon, label, isFocused, isMain = false }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (isFocused) {
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 7,
        tension: 40,
        useNativeDriver: true
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true
      }).start();
    }
  }, [isFocused]);
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  
  if (isMain) {
    return (
      <Pressable onPress={handlePress} style={styles.mainTabContainer}>
        <View style={styles.mainTabButton}>
          <Ionicons name={icon} size={26} color="#FFFFFF" />
        </View>
      </Pressable>
    );
  }
  
  return (
    <Pressable onPress={handlePress} style={styles.tabButton}>
      <Animated.View style={[
        styles.iconContainer,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        {isFocused && <View style={styles.activeBackground} />}
        <Ionicons 
          name={isFocused ? icon : `${icon}-outline`} 
          size={22} 
          color={isFocused ? '#007AFF' : '#8E8E93'} 
        />
      </Animated.View>
      <Text style={[
        styles.tabLabel, 
        { color: isFocused ? '#007AFF' : '#8E8E93', fontWeight: isFocused ? '600' : '400' }
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBarStyle,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }
        ],
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
        ),
      }}
      tabBar={props => {
        return (
          <View style={styles.container}>
            <View style={styles.tabBar}>
              <TabButton
                icon="home"
                label="Home"
                isFocused={props.state.index === 0}
                onPress={() => props.navigation.navigate('home')}
              />
              <TabButton
                icon="compass"
                label="Passeios"
                isFocused={props.state.index === 1}
                onPress={() => props.navigation.navigate('passeios')}
              />
              <TabButton
                icon="add-circle"
                isMain={true}
                onPress={() => {
                  props.navigation.navigate('cadastro')
                }}
              />
              <TabButton
                icon="paw"
                label="Pets"
                isFocused={props.state.index === 2}
                onPress={() => props.navigation.navigate('gerenciar')}
              />
              <TabButton
                icon="person"
                label="Perfil"
                isFocused={props.state.index === 3}
                onPress={() => props.navigation.navigate('perfil')}
              />
            </View>
          </View>
        );
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="passeios" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  tabLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  mainTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  mainTabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    height: 0,
  },
});