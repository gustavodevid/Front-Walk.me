"use client"

import { Tabs } from "expo-router"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { StyleSheet, View, Text, Pressable, Animated, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BlurView } from "expo-blur"
import { useRef, useEffect } from "react"
import * as Haptics from "expo-haptics"
import { LinearGradient } from "expo-linear-gradient"

// Cores do tema
const THEME = {
  primary: "#FF7A00",
  primaryLight: "#FF9A3D",
  inactive: "#8E8E93",
  activeText: "#FF7A00",
  inactiveText: "#8E8E93",
  background: "rgba(255, 255, 255, 0.9)",
  shadow: "rgba(0, 0, 0, 0.1)",
  white: "#FFFFFF",
}

function TabButton({ onPress, icon, label, isFocused, isMain = false, customIcon = null }) {
  // Animações
  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isFocused) {
      // Animar escala e opacidade quando focado
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Reverter animações quando não focado
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isFocused])

  const handlePress = () => {
    // Feedback tátil ao pressionar
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  // Botão principal (central)
  if (isMain) {
    return (
      <Pressable
        onPress={handlePress}
        style={styles.mainTabContainer}
        android_ripple={{ color: "rgba(255, 255, 255, 0.2)", borderless: true, radius: 28 }}
      >
        <LinearGradient
          colors={[THEME.primaryLight, THEME.primary]}
          style={styles.mainTabButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={icon} size={26} color={THEME.white} />
        </LinearGradient>
      </Pressable>
    )
  }

  // Botões de navegação padrão
  return (
    <Pressable
      onPress={handlePress}
      style={styles.tabButton}
      android_ripple={{ color: "rgba(0, 0, 0, 0.05)", borderless: true, radius: 25 }}
    >
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Animated.View style={[styles.activeBackground, { opacity: opacityAnim }]} />

        {customIcon ? (
          // Usar ícone personalizado se fornecido
          <MaterialCommunityIcons
            name={customIcon}
            size={24}
            color={isFocused ? THEME.activeText : THEME.inactiveText}
          />
        ) : (
          // Usar ícone Ionicons padrão
          <Ionicons
            name={isFocused ? icon : `${icon}-outline`}
            size={24}
            color={isFocused ? THEME.activeText : THEME.inactiveText}
          />
        )}
      </Animated.View>

      <Text
        style={[
          styles.tabLabel,
          {
            color: isFocused ? THEME.activeText : THEME.inactiveText,
            fontWeight: isFocused ? "600" : "400",
            opacity: isFocused ? 1 : 0.8,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

export default function RootLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBarStyle, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }],
        tabBarShowLabel: false,
        tabBarBackground: () => <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />,
      }}
      tabBar={(props) => {
        return (
          <View style={styles.container}>
            <View style={styles.tabBar}>
              <TabButton
                icon="home"
                label="Home"
                isFocused={props.state.index === 0}
                onPress={() => props.navigation.navigate("home")}
              />
              <TabButton
                customIcon="map-marker-path"
                label="Passeios"
                isFocused={props.state.index === 1}
                onPress={() => props.navigation.navigate("passeios")}
              />
              <TabButton
                icon="add-circle"
                isMain={true}
                onPress={() => {
                  props.navigation.navigate("cadastro")
                }}
              />
              <TabButton
                customIcon="dog"
                label="Pets"
                isFocused={props.state.index === 2}
                onPress={() => props.navigation.navigate("gerenciar")}
              />
              <TabButton
                icon="person"
                label="Perfil"
                isFocused={props.state.index === 3}
                onPress={() => props.navigation.navigate("perfil")}
              />
            </View>
          </View>
        )
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="passeios" />
      <Tabs.Screen name="gerenciar" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: THEME.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: Platform.OS === "ios" ? 1 : 0,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingVertical: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  activeBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 22,
    backgroundColor: "rgba(255, 122, 0, 0.1)",
  },
  tabLabel: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },
  mainTabContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
  },
  mainTabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarStyle: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
    height: 0,
  },
})

