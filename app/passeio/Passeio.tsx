"use client"

import { useState, useEffect, useRef } from "react"
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  Image,
  Animated,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import axios from "axios"
import { router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import type { Geometry } from "geojson"
import config from "../../config"
import customMap from "../../assets/maps/customMap.json"
import getFullImagePath from "../utils/utils"
import styles from "./passeio.styles"

// Interfaces
interface Passeador {
  passeadorId: string
  nome: string
  latitude: string
  longitude: string
  foto?: string
  avaliacao?: number
  distancia?: string
}

interface Pet {
  petId: string
  nome: string
  raca: string
  foto?: string
}

interface Servico {
  passeadorId: string
  petId: string
  tutorId: string
  dataServico: Date
  horarioServico?: string
  localizacaoServico: Geometry
  tipoServico: "passeio"
}

export default function Passeios() {
  // Refs & Hooks
  const insets = useSafeAreaInsets()
  const mapRef = useRef<MapView>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(100)).current
  const screenWidth = Dimensions.get("window").width

  // State - Location & Map
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)

  // State - Data
  const [passeadores, setPasseadores] = useState<Passeador[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [tutorFotoUri, setTutorFotoUri] = useState<string | null>(null)

  // State - Selection
  const [selectedPasseador, setSelectedPasseador] = useState<Passeador | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<Date>(new Date())

  // State - UI
  const [loading, setLoading] = useState(true)
  const [showPetModal, setShowPetModal] = useState<boolean>(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showPasseadorDetails, setShowPasseadorDetails] = useState(false)

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

    initializeData()
  }, [])

  useEffect(() => {
    if (selectedPasseador) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [selectedPasseador])

  // Initialization
  const initializeData = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar a localização foi negada")
        return
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      setLocation(location)

      // Fetch user data and passeadores
      await Promise.all([fetchUserData(), fetchPasseadores(location)])

      setLoading(false)
    } catch (error) {
      console.error("Erro ao inicializar dados:", error)
      Alert.alert(
        "Erro de Inicialização",
        "Não foi possível carregar os dados necessários. Verifique sua conexão e tente novamente.",
      )
      setLoading(false)
    }
  }

  // Data fetching
  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId")
      if (userId) {
        fetchUserPhoto(userId)
      } else {
        console.warn("ID do usuário não encontrado")
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error)
      throw error
    }
  }

  const fetchUserPhoto = async (userId: string) => {
    try {
      const response = await axios.get(`${config.API_URL}/tutor/${userId}`)
      if (response.data && response.data.foto) {
        setTutorFotoUri(response.data.foto)
      }
    } catch (error) {
      console.error("Erro ao buscar foto do usuário:", error)
      throw error
    }
  }

  const fetchPasseadores = async (userLocation?: Location.LocationObject) => {
    try {
      const response = await axios.get(`${config.API_URL}/passeador`)

      // Process passeadores in parallel for better performance
      const passeadoresComFoto = await Promise.all(
        response.data.map(async (passeador: any) => {
          try {
            const passeadorDetalhes = await axios.get(`${config.API_URL}/passeador/${passeador.passeadorId}`)

            // Calculate distance if user location is available
            let distancia = "? km"
            if (userLocation) {
              const passeadorLat = Number.parseFloat(passeador.latitude)
              const passeadorLng = Number.parseFloat(passeador.longitude)
              const userLat = userLocation.coords.latitude
              const userLng = userLocation.coords.longitude

              // Simple distance calculation (Haversine formula would be more accurate)
              const distance = calculateDistance(userLat, userLng, passeadorLat, passeadorLng)

              distancia = `${distance.toFixed(1)} km`
            }

            return {
              ...passeador,
              foto: passeadorDetalhes.data.foto,
              avaliacao: passeadorDetalhes.data.avaliacao || Math.floor(Math.random() * 5) + 3,
              distancia,
            }
          } catch (error) {
            console.error(`Erro ao buscar detalhes do passeador ${passeador.passeadorId}:`, error)
            return {
              ...passeador,
              foto: null,
              avaliacao: Math.floor(Math.random() * 5) + 3,
              distancia: "? km",
            }
          }
        }),
      )

      setPasseadores(passeadoresComFoto)
    } catch (error) {
      console.error("Erro ao buscar passeadores:", error)
      throw error
    }
  }

  const fetchPets = async () => {
    try {
      setLoading(true)
      const userId = await AsyncStorage.getItem("userId")

      if (!userId) {
        Alert.alert("Erro", "Usuário não autenticado.")
        return
      }

      const response = await axios.get(`${config.API_URL}/pet/tutor/${userId}`)
      setPets(response.data)
    } catch (error) {
      console.error("Erro ao buscar pets:", error)
      Alert.alert("Erro", "Erro ao buscar seus pets. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Utility functions
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Event handlers
  const handleMapReady = () => {
    setMapReady(true)
  }

  const handleMarkerPress = (passeador: Passeador) => {
    setSelectedPasseador(passeador)
    setShowPasseadorDetails(true)

    // Center map on selected passeador
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: Number.parseFloat(passeador.latitude),
        longitude: Number.parseFloat(passeador.longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    }
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setSelectedDate(selectedDate)
    }
  }

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false)
    if (selectedTime) {
      setSelectedTime(selectedTime)
    }
  }

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet)
    setShowPetModal(false)
  }

  const handleProporPasseio = async () => {
    if (!selectedPasseador) {
      Alert.alert("Erro", "Selecione um passeador.")
      return
    }

    if (!selectedPet) {
      Alert.alert("Erro", "Selecione um pet.")
      return
    }

    try {
      const userId = await AsyncStorage.getItem("userId")

      if (!userId) {
        Alert.alert("Erro", "Usuário não autenticado.")
        return
      }

      if (!location) {
        Alert.alert("Erro", "Localização não disponível.")
        return
      }

      // Combine date and time
      const dataServico = new Date(selectedDate)
      dataServico.setHours(selectedTime.getHours())
      dataServico.setMinutes(selectedTime.getMinutes())

      const servico: Servico = {
        passeadorId: selectedPasseador.passeadorId,
        petId: selectedPet.petId,
        tutorId: userId,
        dataServico: dataServico,
        horarioServico: formatTime(selectedTime),
        localizacaoServico: {
          type: "Point",
          coordinates: [location.coords.longitude, location.coords.latitude],
        },
        tipoServico: "passeio",
      }

      Alert.alert(
        "Propor Passeio",
        `Deseja propor um passeio para ${selectedPet.nome} com ${selectedPasseador.nome} em ${selectedDate.toLocaleDateString()} às ${formatTime(selectedTime)}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () => cadastrarServicoPasseio(servico),
          },
        ],
      )
    } catch (error) {
      console.error("Erro ao preparar proposta de passeio:", error)
      Alert.alert("Erro", "Erro ao preparar proposta de passeio. Tente novamente.")
    }
  }

  const cadastrarServicoPasseio = async (servico: Servico) => {
    try {
      setLoading(true)
      const response = await axios.post(`${config.API_URL}/servico`, servico)
      console.log("Serviço de passeio cadastrado com sucesso:", response.data)

      Alert.alert(
        "Passeio Agendado!",
        "Seu passeio foi proposto com sucesso. Você receberá uma notificação quando o passeador aceitar.",
        [
          {
            text: "OK",
            onPress: () => {
              setSelectedPasseador(null)
              router.push("/principal/home")
            },
          },
        ],
      )
    } catch (error) {
      console.error("Erro ao cadastrar serviço de passeio:", error)
      Alert.alert("Erro", "Não foi possível agendar o passeio. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Render functions
  const renderMarker = (passeador: Passeador) => {
    const fotoUri = passeador.foto?.trim()
    const isSelected = selectedPasseador?.passeadorId === passeador.passeadorId

    return (
      <Marker
        key={passeador.passeadorId}
        coordinate={{
          latitude: Number.parseFloat(passeador.latitude),
          longitude: Number.parseFloat(passeador.longitude),
        }}
        title={passeador.nome}
        onPress={() => handleMarkerPress(passeador)}
      >
        <View style={[styles.markerWrapper, isSelected && styles.selectedMarkerWrapper]}>
          <Image
            source={fotoUri ? { uri: getFullImagePath(fotoUri) } : defaultImage}
            style={styles.markerImage}
            onError={() => console.log(`Erro ao carregar imagem do passeador ${passeador.nome}`)}
          />
          {isSelected && (
            <View style={styles.markerBadge}>
              <Ionicons name="checkmark" size={10} color="#FFF" />
            </View>
          )}
        </View>
        <View style={[styles.markerPointer, isSelected && styles.selectedMarkerPointer]} />
      </Marker>
    )
  }

  const renderPetItem = (pet: Pet) => {
    const isSelected = selectedPet?.petId === pet.petId

    return (
      <TouchableOpacity
        key={pet.petId}
        style={[styles.petItem, isSelected && styles.selectedPetItem]}
        onPress={() => handleSelectPet(pet)}
        activeOpacity={0.7}
      >
        <View style={styles.petImageContainer}>
          <Image
            source={pet.foto ? { uri: getFullImagePath(pet.foto) } : defaultImage}
            style={styles.petImage}
            onError={() => console.log(`Erro ao carregar imagem do pet ${pet.nome}`)}
          />
        </View>
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.nome}</Text>
          <Text style={styles.petRaca}>{pet.raca}</Text>
        </View>
        {isSelected && (
          <View style={styles.petSelectedIcon}>
            <Ionicons name="checkmark-circle" size={24} color="#FF7A00" />
          </View>
        )}
      </TouchableOpacity>
    )
  }

  // Loading state
  if (loading && !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Carregando mapa...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 16 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Buscar Passeio</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Map */}
        {location && (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            customMapStyle={customMap}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            showsUserLocation={false}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
            onMapReady={handleMapReady}
          >
            {/* User Marker */}
            <Marker coordinate={location.coords} title="Minha Localização">
              <View style={[styles.markerWrapper, styles.userMarkerWrapper]}>
                <Image
                  source={tutorFotoUri ? { uri: getFullImagePath(tutorFotoUri) } : defaultImage}
                  style={styles.markerImage}
                />
              </View>
              <View style={[styles.markerPointer, styles.userMarkerPointer]} />
            </Marker>

            {/* Passeadores Markers */}
            {mapReady && passeadores.map(renderMarker)}
          </MapView>
        )}

        {/* Passeador Details Card */}
        {selectedPasseador && (
          <Animated.View style={[styles.passeadorCard, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.passeadorCardHeader}>
              <View style={styles.passeadorInfo}>
                <Image
                  source={selectedPasseador.foto ? { uri: getFullImagePath(selectedPasseador.foto) } : defaultImage}
                  style={styles.passeadorCardImage}
                />
                <View>
                  <Text style={styles.passeadorCardName}>{selectedPasseador.nome}</Text>
                  <View style={styles.passeadorCardRating}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.passeadorCardRatingText}>
                      {selectedPasseador.avaliacao?.toFixed(1) || "4.5"}
                    </Text>
                    <Text style={styles.passeadorCardDistance}>• {selectedPasseador.distancia || "1.2 km"}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPasseador(null)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {/* Pet Selection */}
              <TouchableOpacity
                style={styles.formField}
                onPress={() => {
                  fetchPets()
                  setShowPetModal(true)
                }}
              >
                <View style={styles.formIconContainer}>
                  <MaterialCommunityIcons name="dog" size={20} color="#FF7A00" />
                </View>
                <View style={styles.formFieldContent}>
                  <Text style={styles.formLabel}>Pet</Text>
                  <Text style={styles.formValue}>{selectedPet ? selectedPet.nome : "Selecione seu pet"}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              {/* Date Selection */}
              <TouchableOpacity style={styles.formField} onPress={() => setShowDatePicker(true)}>
                <View style={styles.formIconContainer}>
                  <Ionicons name="calendar-outline" size={20} color="#FF7A00" />
                </View>
                <View style={styles.formFieldContent}>
                  <Text style={styles.formLabel}>Data</Text>
                  <Text style={styles.formValue}>
                    {selectedDate.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              {/* Time Selection */}
              <TouchableOpacity style={styles.formField} onPress={() => setShowTimePicker(true)}>
                <View style={styles.formIconContainer}>
                  <Ionicons name="time-outline" size={20} color="#FF7A00" />
                </View>
                <View style={styles.formFieldContent}>
                  <Text style={styles.formLabel}>Horário</Text>
                  <Text style={styles.formValue}>{formatTime(selectedTime)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.proposeButton}
              onPress={handleProporPasseio}
              disabled={!selectedPet}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF9A3D", "#FF7A00"]}
                style={styles.proposeButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.proposeButtonText}>Propor Passeio</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            testID="timeTimePicker"
            value={selectedTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}

        {/* Pet Selection Modal */}
        <Modal visible={showPetModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecione seu Pet</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowPetModal(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {pets.length > 0 ? (
                <ScrollView style={styles.petList}>{pets.map(renderPetItem)}</ScrollView>
              ) : (
                <View style={styles.emptyPetContainer}>
                  <MaterialCommunityIcons name="dog" size={48} color="#CCC" />
                  <Text style={styles.emptyPetText}>Você ainda não cadastrou nenhum pet</Text>
                  <TouchableOpacity
                    style={styles.addPetButton}
                    onPress={() => {
                      setShowPetModal(false)
                      router.push("/principal/cadastro")
                    }}
                  >
                    <Text style={styles.addPetButtonText}>Cadastrar Pet</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </Animated.View>
    </SafeAreaView>
  )
}


