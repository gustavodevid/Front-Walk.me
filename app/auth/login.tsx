"use client"

import React, { useState } from "react"
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Keyboard,
} from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import loginTutor from "../services/api/auth/LoginTutor"
import { storeData } from "../utils/Storage/StoreData"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const fadeAnim = useState(new Animated.Value(0))[0]

  // Animação de entrada
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  // Validação de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email é obrigatório")
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError("Email inválido")
      return false
    }
    setEmailError("")
    return true
  }

  // Validação de senha
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Senha é obrigatória")
      return false
    } else if (password.length < 6) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleLogin = async () => {
    Keyboard.dismiss()

    // Validação do formulário
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(senha)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)
    try {
      const response = await loginTutor(email, senha)

      if (response.data.token) {
        const { token, userName, userEmail, userId } = response.data
        await storeData("token", token)
        await storeData("userName", userName)
        await storeData("userEmail", userEmail)
        await storeData("userId", userId)

        // Animação de saída antes de navegar
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          router.push("/principal/home")
        })
      } else {
        Alert.alert("Erro", "Login falhou. Verifique suas credenciais.")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    router.push("/auth/recuperar-senha")
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.imageContainer}>
            <Image style={styles.logo} source={require("../../assets/images/cao-login.jpg")} resizeMode="cover" />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Au-Au! (Olá)</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>

            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
                <MaterialCommunityIcons name="email-outline" size={24} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text)
                    if (emailError) validateEmail(text)
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#888"
                  onBlur={() => validateEmail(email)}
                  accessibilityLabel="Campo de email"
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, passwordError ? styles.inputError : null]}>
                <MaterialCommunityIcons name="lock-outline" size={24} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  value={senha}
                  onChangeText={(text) => {
                    setSenha(text)
                    if (passwordError) validatePassword(text)
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  placeholderTextColor="#888"
                  onBlur={() => validatePassword(senha)}
                  accessibilityLabel="Campo de senha"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              accessibilityLabel="Esqueceu sua senha?"
            >
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
              accessibilityLabel="Botão de login"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF9A3D", "#FF7A00"]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Entrar</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => router.push("/auth/cadastro")}
              accessibilityLabel="Criar nova conta"
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>Criar nova conta</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}



