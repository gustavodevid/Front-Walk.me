"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  StatusBar,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import * as ImagePicker from "expo-image-picker"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import FormData from "form-data"
import config from "../../config"
import styles from "../styles/cadastropet.styles"

type CadastroPetProps = {}

const CadastroPet: React.FC<CadastroPetProps> = () => {
  // Refs
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const insets = useSafeAreaInsets()

  // Form state
  const [nome, setNome] = useState("")
  const [raca, setRaca] = useState("")
  const [idade, setIdade] = useState("")
  const [peso, setPeso] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [foto, setFoto] = useState<string | null>(null)
  const [tutorId, setTutorId] = useState<string | null>(null)

  // UI state
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)

  // Effects
  useEffect(() => {
    StatusBar.setBarStyle("dark-content")
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("transparent")
      StatusBar.setTranslucent(true)
    }

    // Fetch user ID
    const fetchTutorId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId")
        if (storedUserId) {
          setTutorId(storedUserId)
        }
      } catch (error) {
        console.error("Erro ao recuperar o ID do tutor:", error)
      }
    }

    fetchTutorId()

    // Animations
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

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true))
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false))

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
    }

    if (!raca.trim()) {
      newErrors.raca = "Raça é obrigatória"
    }

    if (!idade.trim()) {
      newErrors.idade = "Idade é obrigatória"
    } else if (isNaN(Number(idade)) || Number(idade) <= 0) {
      newErrors.idade = "Idade deve ser um número positivo"
    }

    if (peso && (isNaN(Number(peso)) || Number(peso) <= 0)) {
      newErrors.peso = "Peso deve ser um número positivo"
    }

    if (!foto) {
      newErrors.foto = "Foto é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Image picker
  const escolherFoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permissão negada", "Precisamos de permissão para acessar suas fotos")
        return
      }

      setPhotoLoading(true)

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!resultado.canceled) {
        setFoto(resultado.assets[0].uri)
        // Clear any previous error
        setErrors((prev) => ({ ...prev, foto: "" }))
      }
    } catch (error) {
      console.error("Erro ao selecionar foto:", error)
      Alert.alert("Erro", "Não foi possível selecionar a foto. Tente novamente.")
    } finally {
      setPhotoLoading(false)
    }
  }

  const tirarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permissão negada", "Precisamos de permissão para acessar sua câmera")
        return
      }

      setPhotoLoading(true)

      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!resultado.canceled) {
        setFoto(resultado.assets[0].uri)
        // Clear any previous error
        setErrors((prev) => ({ ...prev, foto: "" }))
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error)
      Alert.alert("Erro", "Não foi possível tirar a foto. Tente novamente.")
    } finally {
      setPhotoLoading(false)
    }
  }

  // Form submission
  const cadastrarPet = async () => {
    Keyboard.dismiss()

    if (!validateForm()) {
      return
    }

    if (!tutorId) {
      Alert.alert("Erro", "ID do tutor não encontrado. Faça login novamente.")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("nome", nome)
      formData.append("raca", raca)
      formData.append("idade", Number.parseInt(idade))
      formData.append("tutorId", tutorId)

      if (peso) {
        formData.append("peso", Number.parseFloat(peso))
      }

      if (observacoes) {
        formData.append("observacoes", observacoes)
      }

      if (foto) {
        const filename = foto.split("/").pop() || `pet-${Date.now()}.jpg`
        const match = /\.(\w+)$/.exec(filename)
        const type = match ? `image/${match[1]}` : "image/jpeg"

        formData.append("foto", {
          uri: foto,
          type,
          name: filename,
        } as any)
      }

      const response = await axios.post(`${config.API_URL}/pet`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Pet cadastrado com sucesso:", response.data)

      Alert.alert("Sucesso!", `${nome} foi cadastrado com sucesso!`, [
        {
          text: "OK",
          onPress: () => router.push("/principal/gerenciar"),
        },
      ])
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error)
      Alert.alert("Erro", "Não foi possível cadastrar o pet. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Calculate bottom padding to avoid tab bar
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 16

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + bottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.title}>Cadastrar Pet</Text>
              <View style={styles.headerRight} />
            </View>

            {/* Photo Section */}
            <View style={styles.photoSection}>
              <TouchableOpacity
                style={[styles.photoContainer, errors.foto ? styles.photoContainerError : null]}
                onPress={escolherFoto}
                disabled={photoLoading}
              >
                {photoLoading ? (
                  <ActivityIndicator size="large" color="#FF7A00" />
                ) : foto ? (
                  <Image source={{ uri: foto }} style={styles.photoPreview} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="paw" size={40} color="#DDD" />
                    <Text style={styles.photoPlaceholderText}>Adicionar foto</Text>
                  </View>
                )}
              </TouchableOpacity>

              {errors.foto ? <Text style={styles.errorText}>{errors.foto}</Text> : null}

              <View style={styles.photoButtons}>
                <TouchableOpacity style={styles.photoButton} onPress={escolherFoto} disabled={photoLoading}>
                  <Ionicons name="images" size={20} color="#FF7A00" />
                  <Text style={styles.photoButtonText}>Galeria</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.photoButton} onPress={tirarFoto} disabled={photoLoading}>
                  <Ionicons name="camera" size={20} color="#FF7A00" />
                  <Text style={styles.photoButtonText}>Câmera</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome do Pet</Text>
                <View style={[styles.inputContainer, errors.nome ? styles.inputContainerError : null]}>
                  <MaterialCommunityIcons name="dog" size={20} color="#FF7A00" />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Rex"
                    value={nome}
                    onChangeText={(text) => {
                      setNome(text)
                      if (errors.nome) {
                        setErrors((prev) => ({ ...prev, nome: "" }))
                      }
                    }}
                    maxLength={30}
                  />
                </View>
                {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Raça</Text>
                <View style={[styles.inputContainer, errors.raca ? styles.inputContainerError : null]}>
                  <Ionicons name="paw" size={20} color="#FF7A00" />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Labrador"
                    value={raca}
                    onChangeText={(text) => {
                      setRaca(text)
                      if (errors.raca) {
                        setErrors((prev) => ({ ...prev, raca: "" }))
                      }
                    }}
                    maxLength={30}
                  />
                </View>
                {errors.raca ? <Text style={styles.errorText}>{errors.raca}</Text> : null}
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Idade (anos)</Text>
                  <View style={[styles.inputContainer, errors.idade ? styles.inputContainerError : null]}>
                    <Ionicons name="calendar" size={20} color="#FF7A00" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: 3"
                      value={idade}
                      onChangeText={(text) => {
                        setIdade(text.replace(/[^0-9]/g, ""))
                        if (errors.idade) {
                          setErrors((prev) => ({ ...prev, idade: "" }))
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  {errors.idade ? <Text style={styles.errorText}>{errors.idade}</Text> : null}
                </View>

                <View style={[styles.formGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Peso (kg)</Text>
                  <View style={[styles.inputContainer, errors.peso ? styles.inputContainerError : null]}>
                    <Ionicons name="scale" size={20} color="#FF7A00" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: 12.5"
                      value={peso}
                      onChangeText={(text) => {
                        // Allow only numbers and one decimal point
                        setPeso(text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))
                        if (errors.peso) {
                          setErrors((prev) => ({ ...prev, peso: "" }))
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  {errors.peso ? <Text style={styles.errorText}>{errors.peso}</Text> : null}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Observações (opcional)</Text>
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Informações adicionais sobre seu pet..."
                    value={observacoes}
                    onChangeText={setObservacoes}
                    multiline
                    numberOfLines={4}
                    maxLength={200}
                  />
                </View>
                <Text style={styles.charCount}>{observacoes.length}/200</Text>
              </View>
            </View>

            {/* Submit Button (inside ScrollView) */}
            <View style={[styles.buttonContainerInline, { marginBottom: bottomPadding }]}>
              <TouchableOpacity style={styles.submitButton} onPress={cadastrarPet} disabled={loading}>
                <LinearGradient
                  colors={["#FF9A3D", "#FF7A00"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="paw" size={20} color="#FFF" />
                      <Text style={styles.buttonText}>Cadastrar Pet</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}



export default CadastroPet

