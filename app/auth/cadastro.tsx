import React, { useState, useRef } from "react"
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import config from "../../config"
import styles from "./cadastro.styles"

export default function Cadastro() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Refs para navegação entre campos
  const emailRef = useRef(null)
  const senhaRef = useRef(null)
  const confirmarSenhaRef = useRef(null)

  // Animação de entrada
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  // Validação de nome
  const validateNome = (value) => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, nome: "Nome é obrigatório" }))
      return false
    } else if (value.trim().length < 3) {
      setErrors((prev) => ({ ...prev, nome: "Nome deve ter pelo menos 3 caracteres" }))
      return false
    }
    setErrors((prev) => ({ ...prev, nome: "" }))
    return true
  }

  // Validação de email
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) {
      setErrors((prev) => ({ ...prev, email: "Email é obrigatório" }))
      return false
    } else if (!emailRegex.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Email inválido" }))
      return false
    }
    setErrors((prev) => ({ ...prev, email: "" }))
    return true
  }

  // Validação de senha e cálculo de força
  const validateSenha = (value) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, senha: "Senha é obrigatória" }))
      setPasswordStrength(0)
      return false
    }

    // Verificar força da senha
    let strength = 0
    if (value.length >= 8) strength += 1
    if (/[A-Z]/.test(value)) strength += 1
    if (/[0-9]/.test(value)) strength += 1
    if (/[^A-Za-z0-9]/.test(value)) strength += 1

    setPasswordStrength(strength)

    if (value.length < 6) {
      setErrors((prev) => ({ ...prev, senha: "Senha deve ter pelo menos 6 caracteres" }))
      return false
    }

    setErrors((prev) => ({ ...prev, senha: "" }))
    return true
  }

  // Validação de confirmação de senha
  const validateConfirmarSenha = (value) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, confirmarSenha: "Confirmação de senha é obrigatória" }))
      return false
    } else if (value !== senha) {
      setErrors((prev) => ({ ...prev, confirmarSenha: "As senhas não coincidem" }))
      return false
    }
    setErrors((prev) => ({ ...prev, confirmarSenha: "" }))
    return true
  }

  // Validação completa do formulário
  const validateForm = () => {
    const isNomeValid = validateNome(nome)
    const isEmailValid = validateEmail(email)
    const isSenhaValid = validateSenha(senha)
    const isConfirmarSenhaValid = validateConfirmarSenha(confirmarSenha)

    return isNomeValid && isEmailValid && isSenhaValid && isConfirmarSenhaValid
  }

  const handleCadastro = async () => {
    Keyboard.dismiss()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${config.API_URL}/tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      })

      if (response.ok) {
        // Animação de saída antes de mostrar o alerta
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          Alert.alert("Cadastro Realizado", "Seu cadastro foi realizado com sucesso!", [
            {
              text: "Continuar",
              onPress: () => router.push("/auth/login"),
            },
          ])
        })
      } else {
        const errorData = await response.json()
        Alert.alert("Erro no Cadastro", errorData.message || "Não foi possível completar o cadastro. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Renderiza o indicador de força da senha
  const renderPasswordStrength = () => {
    const getStrengthText = () => {
      if (senha.length === 0) return ""
      switch (passwordStrength) {
        case 0:
          return "Muito fraca"
        case 1:
          return "Fraca"
        case 2:
          return "Média"
        case 3:
          return "Forte"
        case 4:
          return "Muito forte"
        default:
          return ""
      }
    }

    const getStrengthColor = () => {
      switch (passwordStrength) {
        case 0:
          return "#FF3B30"
        case 1:
          return "#FF9500"
        case 2:
          return "#FFCC00"
        case 3:
          return "#34C759"
        case 4:
          return "#30D158"
        default:
          return "#E0E0E0"
      }
    }

    return (
      <View style={styles.strengthContainer}>
        <View style={styles.strengthBars}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.strengthBar,
                {
                  backgroundColor: index < passwordStrength ? getStrengthColor() : "#E0E0E0",
                  width: `${23}%`,
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.strengthText, { color: getStrengthColor() }]}>{getStrengthText()}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityLabel="Voltar para a tela anterior"
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Primeiro, precisamos conhecer você.</Text>
              <Text style={styles.description}>Depois, gostaríamos de conhecer o seu pet.</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressText}>Passo 1 de 2</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Seu Nome</Text>
                <View style={[styles.inputContainer, errors.nome ? styles.inputError : null]}>
                  <MaterialCommunityIcons name="account-outline" size={24} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChangeText={(text) => {
                      setNome(text)
                      if (errors.nome) validateNome(text)
                    }}
                    onBlur={() => validateNome(nome)}
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    blurOnSubmit={false}
                    accessibilityLabel="Campo de nome"
                  />
                </View>
                {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Seu Email</Text>
                <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
                  <MaterialCommunityIcons name="email-outline" size={24} color="#888" style={styles.inputIcon} />
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    placeholder="Insira um email válido"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text)
                      if (errors.email) validateEmail(text)
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={() => validateEmail(email)}
                    returnKeyType="next"
                    onSubmitEditing={() => senhaRef.current?.focus()}
                    blurOnSubmit={false}
                    accessibilityLabel="Campo de email"
                  />
                </View>
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Escolha uma senha</Text>
                <View style={[styles.inputContainer, errors.senha ? styles.inputError : null]}>
                  <MaterialCommunityIcons name="lock-outline" size={24} color="#888" style={styles.inputIcon} />
                  <TextInput
                    ref={senhaRef}
                    style={styles.input}
                    placeholder="Digite uma senha forte"
                    value={senha}
                    onChangeText={(text) => {
                      setSenha(text)
                      validateSenha(text)
                      if (confirmarSenha) validateConfirmarSenha(confirmarSenha)
                    }}
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmarSenhaRef.current?.focus()}
                    blurOnSubmit={false}
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
                {renderPasswordStrength()}
                {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirme sua senha</Text>
                <View style={[styles.inputContainer, errors.confirmarSenha ? styles.inputError : null]}>
                  <MaterialCommunityIcons name="lock-check-outline" size={24} color="#888" style={styles.inputIcon} />
                  <TextInput
                    ref={confirmarSenhaRef}
                    style={styles.input}
                    placeholder="Repita sua senha"
                    value={confirmarSenha}
                    onChangeText={(text) => {
                      setConfirmarSenha(text)
                      if (errors.confirmarSenha) validateConfirmarSenha(text)
                    }}
                    autoCapitalize="none"
                    secureTextEntry={!showConfirmPassword}
                    onBlur={() => validateConfirmarSenha(confirmarSenha)}
                    returnKeyType="done"
                    accessibilityLabel="Campo de confirmação de senha"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    accessibilityLabel={
                      showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"
                    }
                  >
                    <MaterialCommunityIcons
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmarSenha ? <Text style={styles.errorText}>{errors.confirmarSenha}</Text> : null}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleCadastro}
                disabled={loading}
                accessibilityLabel="Botão de cadastro"
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
                    <Text style={styles.buttonText}>Continuar</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.push("/auth/login")}
                accessibilityLabel="Já tem uma conta? Faça login"
              >
                <Text style={styles.loginLinkText}>
                  Já tem uma conta? <Text style={styles.loginLinkTextBold}>Faça login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

