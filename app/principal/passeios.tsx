import { useState, useEffect, useCallback, useRef } from "react"
import {
  Text,
  View,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  StatusBar,
  Platform,
  Image,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import axios from "axios"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useFocusEffect } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import config from "../../config"
import getFullImagePath from "../utils/utils"
import styles from "../styles/meuspasseio.styles"

// Interfaces
interface Passeador {
  nome: string
  foto?: string
  avaliacao?: number
}

interface Pet {
  nome: string
  foto?: string
  raca?: string
}

interface Servico {
  servicoId: number
  passeadorId: number
  petId: number
  dataServico: string
  horario: string
  status: string
  passeador: Passeador
  pet: Pet
  localizacao?: {
    latitude: number
    longitude: number
  }
}

export default function MeusPasseios() {
  // Refs & Hooks
  const insets = useSafeAreaInsets()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scrollY = useRef(new Animated.Value(0)).current

  // State
  const [servicos, setServicos] = useState<Servico[]>([])
  const [filteredServicos, setFilteredServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>("todos")
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  // Constants
  const defaultImage = require("../../assets/images/cao-login.jpg")

  // Effects
  useEffect(() => {
    StatusBar.setBarStyle("dark-content")
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("transparent")
      StatusBar.setTranslucent(true)
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    filterServicos(activeFilter)
  }, [servicos, activeFilter])

  useFocusEffect(
    useCallback(() => {
      fetchServicos()
      return () => {}
    }, []),
  )

  // Data fetching
  const fetchServicos = useCallback(async () => {
    setLoading(true)
    try {
      const userId = await AsyncStorage.getItem("userId")
      if (!userId) {
        Alert.alert("Erro", "Usuário não autenticado.")
        return
      }

      const response = await axios.get<Servico[]>(`${config.API_URL}/servico/tutor/${userId}`)

      // Adicionar status simulado se não existir
      const servicosComStatus = response.data.map((servico) => {
        if (!servico.status) {
          const dataServico = new Date(servico.dataServico)
          const hoje = new Date()

          let status = "agendado"
          if (dataServico < hoje) {
            status = Math.random() > 0.3 ? "concluido" : "cancelado"
          } else if (dataServico.toDateString() === hoje.toDateString()) {
            status = Math.random() > 0.5 ? "em_andamento" : "agendado"
          }

          return { ...servico, status }
        }
        return servico
      })

      // Ordenar por data (mais recentes primeiro)
      const servicosOrdenados = servicosComStatus.sort((a, b) => {
        const dataA = new Date(a.dataServico)
        const dataB = new Date(b.dataServico)
        return dataB.getTime() - dataA.getTime()
      })

      setServicos(servicosOrdenados)
    } catch (error) {
      console.error("Erro ao buscar serviços:", error)
      Alert.alert(
        "Erro de Conexão",
        "Não foi possível carregar seus passeios. Verifique sua conexão e tente novamente.",
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Filter functions
  const filterServicos = (filter: string) => {
    switch (filter) {
      case "agendados":
        setFilteredServicos(servicos.filter((s) => s.status === "agendado" || s.status === "em_andamento"))
        break
      case "concluidos":
        setFilteredServicos(servicos.filter((s) => s.status === "concluido"))
        break
      case "cancelados":
        setFilteredServicos(servicos.filter((s) => s.status === "cancelado"))
        break
      default:
        setFilteredServicos(servicos)
        break
    }
  }

  // Event handlers
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchServicos()
  }, [fetchServicos])

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter)
  }

  const handleDeleteServico = async (servicoId: number) => {
    setDeleteConfirmId(null)

    try {
      setLoading(true)
      await axios.delete(`${config.API_URL}/servico/${servicoId}`)

      // Atualizar estado local para feedback imediato
      setServicos((prevServicos) => prevServicos.filter((s) => s.servicoId !== servicoId))

      Alert.alert("Sucesso", "Passeio cancelado com sucesso.")
    } catch (error) {
      console.error("Erro ao excluir serviço:", error)
      Alert.alert("Erro", "Não foi possível cancelar o passeio. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (servicoId: number) => {
    setDeleteConfirmId(servicoId)
  }

  // Utility functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "--:--"
    return timeString.substring(0, 5)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado":
        return "#FF9800"
      case "em_andamento":
        return "#2196F3"
      case "concluido":
        return "#4CAF50"
      case "cancelado":
        return "#F44336"
      default:
        return "#757575"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "agendado":
        return "Agendado"
      case "em_andamento":
        return "Em andamento"
      case "concluido":
        return "Concluído"
      case "cancelado":
        return "Cancelado"
      default:
        return "Desconhecido"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "agendado":
        return "calendar"
      case "em_andamento":
        return "walk"
      case "concluido":
        return "checkmark-circle"
      case "cancelado":
        return "close-circle"
      default:
        return "help-circle"
    }
  }

  const isUpcoming = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return date >= today
  }

  // Render functions
  const renderServicoCard = (servico: Servico) => {
    const isConfirmingDelete = deleteConfirmId === servico.servicoId
    const upcoming = isUpcoming(servico.dataServico)
    const statusColor = getStatusColor(servico.status)
    const statusText = getStatusText(servico.status)
    const statusIcon = getStatusIcon(servico.status)
    const passeadorFoto = servico.passeador?.foto?.trim()
    const petFoto = servico.pet?.foto?.trim()

    return (
      <View key={servico.servicoId} style={[styles.servicoCard, servico.status === "cancelado" && styles.canceledCard]}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Ionicons name={statusIcon} size={12} color="#FFF" />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        {/* Card Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.servicoTitle}>Passeio</Text>
          <Text style={styles.servicoDate}>
            {formatDate(servico.dataServico)} às {formatTime(servico.horario)}
          </Text>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          {/* Passeador Info */}
          <View style={styles.infoRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={passeadorFoto ? { uri: getFullImagePath(passeadorFoto) } : defaultImage}
                style={styles.avatar}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Walker</Text>
              <Text style={styles.infoValue}>{servico.passeador.nome}</Text>
            </View>
          </View>

          {/* Pet Info */}
          <View style={styles.infoRow}>
            <View style={styles.avatarContainer}>
              <Image source={petFoto ? { uri: getFullImagePath(petFoto) } : defaultImage} style={styles.avatar} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Pet</Text>
              <Text style={styles.infoValue}>{servico.pet.nome}</Text>
            </View>
          </View>
        </View>

        {/* Card Actions */}
        {isConfirmingDelete ? (
          <View style={styles.confirmDeleteContainer}>
            <Text style={styles.confirmText}>Cancelar este passeio?</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setDeleteConfirmId(null)}
              >
                <Text style={styles.confirmButtonText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmDeleteButton]}
                onPress={() => handleDeleteServico(servico.servicoId)}
              >
                <Text style={styles.confirmButtonText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.cardActions}>
            {upcoming && servico.status !== "cancelado" && (
              <TouchableOpacity style={styles.actionButton} onPress={() => confirmDelete(servico.servicoId)}>
                <Ionicons name="close-circle-outline" size={20} color="#F44336" />
                <Text style={[styles.actionText, { color: "#F44336" }]}>Cancelar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="information-circle-outline" size={20} color="#2196F3" />
              <Text style={[styles.actionText, { color: "#2196F3" }]}>Detalhes</Text>
            </TouchableOpacity>

            {servico.status === "concluido" && (
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="star-outline" size={20} color="#FF9800" />
                <Text style={[styles.actionText, { color: "#FF9800" }]}>Avaliar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="dog-side" size={80} color="#DDD" />
      <Text style={styles.emptyTitle}>Nenhum passeio encontrado</Text>
      <Text style={styles.emptyText}>
        {activeFilter === "todos"
          ? "Você ainda não agendou nenhum passeio para seus pets."
          : `Não há passeios ${
              activeFilter === "agendados" ? "agendados" : activeFilter === "concluidos" ? "concluídos" : "cancelados"
            }.`}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => {
          // Navegar para a tela de busca de passeios
        }}
      >
        <LinearGradient
          colors={["#FF9A3D", "#FF7A00"]}
          style={styles.emptyButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.emptyButtonText}>Agendar Passeio</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  // Loading state
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Carregando passeios...</Text>
      </View>
    )
  }

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [60, 50],
    extrapolate: "clamp",
  })

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top > 0 ? insets.top : 16,
            height: headerHeight,
          },
        ]}
      >
        <Text style={styles.title}>Meus Passeios</Text>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>


        {/* Passeios List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF7A00"]} tintColor="#FF7A00" />
          }
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        >
          {filteredServicos.length > 0 ? filteredServicos.map(renderServicoCard) : renderEmptyState()}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  )
}
