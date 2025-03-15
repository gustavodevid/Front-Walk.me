"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useFocusEffect } from "expo-router"
import config from "../../config"
import getFullImagePath from "../utils/utils"
import styles from "../styles/gerenciarpet.styles"

interface Pet {
  petId: string
  nome: string
  raca: string
  idade: number
  peso?: number
  observacoes?: string
  tutorId: string
  foto?: string | null
}

export default function GerenciarPets() {
  // Refs & Hooks
  const insets = useSafeAreaInsets()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const screenWidth = Dimensions.get("window").width

  // State
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [optionsModalVisible, setOptionsModalVisible] = useState(false)
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)
  const [petDetailsVisible, setPetDetailsVisible] = useState(false)

  // Constants
  const defaultImage = require("../../assets/images/cao-login.jpg")

  // Effects
  useEffect(() => {
    StatusBar.setBarStyle("dark-content")
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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Refresh pets list when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPets()
      return () => {}
    }, []),
  )

  // Data fetching
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
      Alert.alert("Erro de Conexão", "Não foi possível carregar seus pets. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Event handlers
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchPets()
  }, [])

  const handleAddPet = () => {
    router.push("/principal/cadastro")
  }

  const handlePetPress = (pet: Pet) => {
    setSelectedPet(pet)
    setPetDetailsVisible(true)
  }

  const handlePetOptions = (pet: Pet) => {
    setSelectedPet(pet)
    setOptionsModalVisible(true)
  }

  const handleDeletePet = async () => {
    if (!selectedPet) return

    setConfirmDeleteVisible(false)
    setOptionsModalVisible(false)
    setLoading(true)

    try {
      await axios.delete(`${config.API_URL}/pet/${selectedPet.petId}`)

      // Update local state for immediate feedback
      setPets((prevPets) => prevPets.filter((p) => p.petId !== selectedPet.petId))

      Alert.alert("Sucesso", `${selectedPet.nome} foi removido com sucesso!`)
    } catch (error) {
      console.error("Erro ao excluir pet:", error)
      Alert.alert("Erro", "Não foi possível excluir o pet. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditPet = () => {
    if (!selectedPet) return

    setOptionsModalVisible(false)
    // Navigate to edit pet screen with pet data
    // router.push({
    //   pathname: "/pet/editar",
    //   params: { id: selectedPet.petId },
    // })
  }

  // Render functions
  const renderPetItem = ({ item: pet, index }: { item: Pet; index: number }) => {
    const fotoUri = pet.foto?.trim()
    const animationDelay = index * 100

    // Calculate pet age text
    const ageText = pet.idade === 1 ? "1 ano" : `${pet.idade} anos`

    return (
      <Animated.View
        style={[
          styles.petCardContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            width: screenWidth - 32,
          },
        ]}
      >
        <TouchableOpacity style={styles.petCard} onPress={() => handlePetPress(pet)} activeOpacity={0.8}>
          <View style={styles.petImageContainer}>
            <Image
              style={styles.petImage}
              source={fotoUri ? { uri: getFullImagePath(fotoUri) } : defaultImage}
              onError={() => console.log(`Erro ao carregar imagem ${pet.nome}`)}
            />
          </View>

          <View style={styles.petInfo}>
            <Text style={styles.petNome}>{pet.nome}</Text>
            <Text style={styles.petRaca}>{pet.raca}</Text>
            <Text style={styles.petIdade}>{ageText}</Text>
          </View>

          <TouchableOpacity style={styles.optionsButton} onPress={() => handlePetOptions(pet)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="dog" size={80} color="#DDD" />
      <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
      <Text style={styles.emptyText}>Cadastre seu primeiro pet para começar a usar o aplicativo.</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleAddPet}>
        <LinearGradient
          colors={["#FF9A3D", "#FF7A00"]}
          style={styles.emptyButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.emptyButtonText}>Cadastrar Pet</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  // Loading state
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Carregando seus pets...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 16 }]}>
        <Text style={styles.title}>Meus Pets</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
          <LinearGradient
            colors={["#FF9A3D", "#FF7A00"]}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Pets List */}
      <FlatList
        data={pets}
        keyExtractor={(pet) => pet.petId}
        renderItem={renderPetItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF7A00"]} tintColor="#FF7A00" />
        }
        ListEmptyComponent={renderEmptyList}
      />

      {/* Pet Options Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOptionsModalVisible(false)}>
          <View style={styles.optionsModalContainer}>
            <View style={styles.optionsModal}>
              {selectedPet && (
                <>
                  <View style={styles.optionsHeader}>
                    <Text style={styles.optionsTitle}>Opções</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setOptionsModalVisible(false)}>
                      <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.optionItem} onPress={handleEditPet}>
                    <Ionicons name="create-outline" size={24} color="#2196F3" />
                    <Text style={styles.optionText}>Editar informações</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      setOptionsModalVisible(false)
                      setConfirmDeleteVisible(true)
                    }}
                  >
                    <Ionicons name="trash-outline" size={24} color="#F44336" />
                    <Text style={[styles.optionText, { color: "#F44336" }]}>Remover pet</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmDeleteVisible}
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setConfirmDeleteVisible(false)}>
          <View style={styles.confirmModalContainer}>
            <View style={styles.confirmModal}>
              {selectedPet && (
                <>
                  <Text style={styles.confirmTitle}>Remover Pet</Text>
                  <Text style={styles.confirmText}>
                    Tem certeza que deseja remover {selectedPet.nome}? Esta ação não pode ser desfeita.
                  </Text>

                  <View style={styles.confirmButtons}>
                    <TouchableOpacity
                      style={[styles.confirmButton, styles.cancelButton]}
                      onPress={() => setConfirmDeleteVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.confirmButton, styles.deleteButton]} onPress={handleDeletePet}>
                      <Text style={styles.deleteButtonText}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Pet Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={petDetailsVisible}
        onRequestClose={() => setPetDetailsVisible(false)}
      >
        <View style={styles.detailsModalOverlay}>
          <View style={styles.detailsModalContainer}>
            {selectedPet && (
              <>
                <TouchableOpacity style={styles.detailsCloseButton} onPress={() => setPetDetailsVisible(false)}>
                  <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.petDetailsHeader}>
                  <Image
                    style={styles.petDetailsImage}
                    source={selectedPet.foto ? { uri: getFullImagePath(selectedPet.foto) } : defaultImage}
                  />
                  <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.petDetailsGradient}>
                    <Text style={styles.petDetailsName}>{selectedPet.nome}</Text>
                  </LinearGradient>
                </View>

                <View style={styles.petDetailsContent}>
                  <View style={styles.petDetailItem}>
                    <View style={styles.petDetailIconContainer}>
                      <Ionicons name="paw" size={20} color="#FF7A00" />
                    </View>
                    <View>
                      <Text style={styles.petDetailLabel}>Raça</Text>
                      <Text style={styles.petDetailValue}>{selectedPet.raca}</Text>
                    </View>
                  </View>

                  <View style={styles.petDetailItem}>
                    <View style={styles.petDetailIconContainer}>
                      <Ionicons name="calendar" size={20} color="#FF7A00" />
                    </View>
                    <View>
                      <Text style={styles.petDetailLabel}>Idade</Text>
                      <Text style={styles.petDetailValue}>
                        {selectedPet.idade === 1 ? "1 ano" : `${selectedPet.idade} anos`}
                      </Text>
                    </View>
                  </View>

                  {selectedPet.peso && (
                    <View style={styles.petDetailItem}>
                      <View style={styles.petDetailIconContainer}>
                        <Ionicons name="scale" size={20} color="#FF7A00" />
                      </View>
                      <View>
                        <Text style={styles.petDetailLabel}>Peso</Text>
                        <Text style={styles.petDetailValue}>{selectedPet.peso} kg</Text>
                      </View>
                    </View>
                  )}

                  {selectedPet.observacoes && (
                    <View style={styles.petObservacoes}>
                      <Text style={styles.petObservacoesLabel}>Observações</Text>
                      <Text style={styles.petObservacoesText}>{selectedPet.observacoes}</Text>
                    </View>
                  )}

                  <View style={styles.petDetailsActions}>
                    <TouchableOpacity
                      style={styles.petDetailsAction}
                      onPress={() => {
                        setPetDetailsVisible(false)
                        handlePetOptions(selectedPet)
                      }}
                    >
                      <Ionicons name="settings-outline" size={20} color="#666" />
                      <Text style={styles.petDetailsActionText}>Opções</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.petDetailsAction}
                      onPress={() => {
                        setPetDetailsVisible(false)
                        // Navigate to schedule screen with pet ID
                        router.push({
                          pathname: "/passeio/Passeio",
                          params: { petId: selectedPet.petId },
                        })
                      }}
                    >
                      <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
                      <Text style={[styles.petDetailsActionText, { color: "#4CAF50" }]}>Agendar Passeio</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}


