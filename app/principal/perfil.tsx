"use client"

import React, { useEffect, useState, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  StatusBar,
  Platform,
  Linking,
  Share,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { router, useFocusEffect } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { LinearGradient } from "expo-linear-gradient"
import config from "../../config"
import getFullImagePath from "../utils/utils"
import styles from "../styles/perfil.syles"

interface UserData {
  nome: string
  email: string
  telefone?: string
  endereco?: string
  foto?: string | null
  dataCadastro?: string
}

export default function Perfil() {
  // Refs & Hooks
  const insets = useSafeAreaInsets()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  // State
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [petCount, setPetCount] = useState<number>(0)
  const [passeiosCount, setPasseiosCount] = useState<number>(0)

  // Constants
  const defaultImage = require("../../assets/images/cao-login.jpg")
  const appVersion = "1.0.0"

  // Effects
  useEffect(() => {
    StatusBar.setBarStyle("light-content")
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("transparent")
      StatusBar.setTranslucent(true)
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Refresh user data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData()
      return () => {}
    }, []),
  )

  // Data fetching
  const fetchUserData = async () => {
    try {
      setLoading(true)

      // Get stored user data
      const storedUserId = await AsyncStorage.getItem("userId")
      const storedUserName = await AsyncStorage.getItem("userName")
      const storedUserEmail = await AsyncStorage.getItem("userEmail")

      if (!storedUserId) {
        // User not logged in, redirect to login
        router.replace("/auth/login")
        return
      }

      setUserId(storedUserId)

      // Initialize with stored data
      setUserData({
        nome: storedUserName || "",
        email: storedUserEmail || "",
      })

      // Fetch complete user data from API
      const response = await axios.get(`${config.API_URL}/tutor/${storedUserId}`)

      if (response.data) {
        setUserData(response.data)
      }

      // Fetch pet count
      const petsResponse = await axios.get(`${config.API_URL}/pet/tutor/${storedUserId}`)
      setPetCount(petsResponse.data.length || 0)

      // Fetch passeios count
      const passeiosResponse = await axios.get(`${config.API_URL}/servico/tutor/${storedUserId}`)
      setPasseiosCount(passeiosResponse.data.length || 0)
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error)
      Alert.alert("Erro de Conexão", "Não foi possível carregar seus dados. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Event handlers
  const handleEditarPerfil = () => {
    router.push("/configuracoes/editarPerfil")
  }

  const handleGerenciarPets = () => {
    router.push("/principal/gerenciar")
  }

  const handleMeusPasseios = () => {
    router.push("/principal/passeios")
  }

  const handleAjuda = () => {
    // Open help center or FAQ
    Alert.alert("Central de Ajuda", "Como podemos ajudar você hoje?", [
      {
        text: "FAQ",
        onPress: () => router.push("/ajuda/faq"),
      },
      {
        text: "Contato",
        onPress: () => Linking.openURL("mailto:suporte@petapp.com"),
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ])
  }

  const handleCompartilhar = async () => {
    try {
      await Share.share({
        message: "Experimente o PetApp para cuidar melhor do seu pet! Baixe agora: https://petapp.com/download",
      })
    } catch (error) {
      console.error("Erro ao compartilhar:", error)
    }
  }

  const handleLogout = async () => {
    Alert.alert("Sair da Conta", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true)

            // Clear all stored user data
            await AsyncStorage.multiRemove(["userId", "userName", "userEmail", "token"])

            // Navigate to login screen
            router.replace("/auth/login")
          } catch (error) {
            console.error("Erro ao fazer logout:", error)
            Alert.alert("Erro", "Não foi possível sair da conta. Tente novamente.")
            setLoading(false)
          }
        },
      },
    ])
  }

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    )
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      return "Data inválida"
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header with gradient background */}
        <LinearGradient
          colors={["#FF9A3D", "#FF7A00"]}
          style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 40 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.profileImageContainer} onPress={handleEditarPerfil} activeOpacity={0.9}>
              <Image
                style={styles.profileImage}
                source={userData?.foto ? { uri: getFullImagePath(userData.foto) } : defaultImage}
              />
              <View style={styles.editBadge}>
                <Feather name="edit-2" size={12} color="#FFF" />
              </View>
            </TouchableOpacity>

            <Text style={styles.profileName}>{userData?.nome || "Usuário"}</Text>
            <Text style={styles.profileEmail}>{userData?.email || "email@exemplo.com"}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{petCount}</Text>
                <Text style={styles.statLabel}>Pets</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statValue}>{passeiosCount}</Text>
                <Text style={styles.statLabel}>Passeios</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatDate(userData?.dataCadastro)}</Text>
                <Text style={styles.statLabel}>Membro desde</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section: Account */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conta</Text>

            <TouchableOpacity style={styles.optionItem} onPress={handleEditarPerfil}>
              <View style={[styles.optionIconContainer, { backgroundColor: "rgba(33, 150, 243, 0.1)" }]}>
                <Feather name="user" size={20} color="#2196F3" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Editar Perfil</Text>
                <Text style={styles.optionDescription}>Alterar suas informações pessoais</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => router.push("/configuracoes/notificacoes")}>
              <View style={[styles.optionIconContainer, { backgroundColor: "rgba(156, 39, 176, 0.1)" }]}>
                <Feather name="bell" size={20} color="#9C27B0" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Notificações</Text>
                <Text style={styles.optionDescription}>Gerenciar suas preferências de notificação</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => router.push("/configuracoes/privacidade")}>
              <View style={[styles.optionIconContainer, { backgroundColor: "rgba(76, 175, 80, 0.1)" }]}>
                <Feather name="lock" size={20} color="#4CAF50" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Privacidade e Segurança</Text>
                <Text style={styles.optionDescription}>Gerenciar configurações de privacidade</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Section: Pets & Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pets e Serviços</Text>

            <TouchableOpacity style={styles.optionItem} onPress={handleGerenciarPets}>
              <View style={[styles.optionIconContainer, { backgroundColor: "rgba(255, 152, 0, 0.1)" }]}>
                <MaterialCommunityIcons name="dog" size={20} color="#FF9800" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Meus Pets</Text>
                <Text style={styles.optionDescription}>Gerenciar seus pets cadastrados</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={handleMeusPasseios}>
              <View style={[styles.optionIconContainer, { backgroundColor: "rgba(0, 150, 136, 0.1)" }]}>
                <Feather name="map" size={20} color="#009688" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Meus Passeios</Text>
                <Text style={styles.optionDescription}>Histórico e agendamentos de passeios</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => router.push("/pagamentos/historico")}>
              <View style={[styles.optionIconContainer, { backgroundColor: "rgba(63, 81, 181, 0.1)" }]}>
                <Feather name="credit-card" size={20} color="#3F51B5" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Pagamentos</Text>
                <Text style={styles.optionDescription}>Métodos de pagamento e histórico</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Section: Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suporte</Text>

            <TouchableOpacity style={styles.optionItem} onPress={handleAjuda}>
              <View style={[styles.optionIconContainer, { backgroundColor: "rgba(33, 150, 243, 0.1)" }]}>
                <Feather name="help-circle" size={20} color="#2196F3" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Central de Ajuda</Text>
                <Text style={styles.optionDescription}>Perguntas frequentes e suporte</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => Linking.openURL("https://petapp.com/termos")}>
              <View style={[styles.optionIconContainer, { backgroundColor: "rgba(96, 125, 139, 0.1)" }]}>
                <Feather name="file-text" size={20} color="#607D8B" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Termos e Políticas</Text>
                <Text style={styles.optionDescription}>Termos de uso e políticas de privacidade</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={handleCompartilhar}>
              <View style={[styles.optionIconContainer, { backgroundColor: "rgba(233, 30, 99, 0.1)" }]}>
                <Feather name="share-2" size={20} color="#E91E63" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Compartilhar App</Text>
                <Text style={styles.optionDescription}>Convide amigos para usar o app</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="#F44336" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={styles.versionText}>Versão {appVersion}</Text>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  )
}



