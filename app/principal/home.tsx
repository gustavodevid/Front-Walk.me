"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Animated,
  StatusBar,
  Platform,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { router } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import config from "../../config"
import getFullImagePath from "../utils/utils"
import styles from "../styles/home.styles"
// Interfaces
interface Passeador {
  passeadorId: string
  nome: string
  email: string
  avaliacao: number
  foto?: string | null
  distancia?: string
}

interface Servico {
  servicoId: number
  passeadorId: number
  petId: number
  data: string
  horario: string
  status: string
  passeador: { nome: string; foto?: string | null }
  pet: { nome: string; foto?: string | null }
}

interface Dica {
  id: string
  titulo: string
  descricao: string
  imagem: any
}

interface Lembrete {
  id: string
  tarefa: string
  pet: string
  data: string
  horario?: string
}

export default function Home() {
  // Refs & Hooks
  const insets = useSafeAreaInsets()
  const scrollY = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  // State
  const [userName, setUserName] = useState<string | null>(null)
  const [passeadores, setPasseadores] = useState<Passeador[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [proximoServico, setProximoServico] = useState<Servico | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState(false)
  const [weather, setWeather] = useState({ temp: "28°C", condition: "Ensolarado", icon: "partly-sunny" })

  // Dados estáticos
  const dicas: Dica[] = [
    {
      id: "1",
      titulo: "Treinando seu pet",
      descricao: "Dicas para treinar seu cão com reforço positivo",
      imagem: require("../../assets/images/cao-login.jpg"),
    },
    {
      id: "2",
      titulo: "Cuidados com a saúde",
      descricao: "Como manter seu pet saudável durante o verão",
      imagem: require("../../assets/images/cao-login.jpg"),
    },
    {
      id: "3",
      titulo: "Alimentação balanceada",
      descricao: "Guia completo para uma dieta saudável",
      imagem: require("../../assets/images/cao-login.jpg"),
    },
  ]

  const lembretes: Lembrete[] = [
    { id: "1", tarefa: "Vacinação", pet: "Rex", data: "28/02/2025", horario: "14:30" },
    { id: "2", tarefa: "Passeio", pet: "Luna", data: "28/02/2025", horario: "16:00" },
  ]

  // Efeitos
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

    fetchData()
  }, [])

  // Funções de busca de dados
  const fetchData = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchUserName(), fetchPasseadores(), fetchServicos()])
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      Alert.alert("Erro de Conexão", "Não foi possível carregar os dados. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchUserName = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem("userName")
      if (storedUserName) {
        setUserName(storedUserName)
      }
    } catch (error) {
      console.error("Erro ao recuperar o nome do usuário:", error)
    }
  }

  const fetchPasseadores = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/passeador`)

      // Processamento em paralelo para melhor performance
      const passeadoresComFoto = await Promise.all(
        response.data.map(async (passeador: any) => {
          try {
            const passeadorDetalhes = await axios.get(`${config.API_URL}/passeador/${passeador.passeadorId}`)

            // Adicionar distância simulada para cada passeador
            const distancia = (Math.random() * 5).toFixed(1) + " km"

            return {
              ...passeador,
              foto: passeadorDetalhes.data.foto,
              distancia,
            }
          } catch (error) {
            console.error(`Erro ao buscar detalhes do passeador ${passeador.passeadorId}:`, error)
            return {
              ...passeador,
              foto: null,
              distancia: "? km",
            }
          }
        }),
      )

      // Ordenar por distância (simulada)
      const passeadoresOrdenados = passeadoresComFoto.sort((a, b) => {
        const distA = Number.parseFloat(a.distancia?.split(" ")[0] || "999")
        const distB = Number.parseFloat(b.distancia?.split(" ")[0] || "999")
        return distA - distB
      })

      setPasseadores(passeadoresOrdenados)
    } catch (error) {
      console.error("Erro ao buscar passeadores:", error)
      throw error
    }
  }

  const fetchServicos = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userId")
      if (userId) {
        const response = await axios.get<Servico[]>(`${config.API_URL}/servico/tutor/${userId}`)

        // Ordenar serviços por data e horário
        const servicosOrdenados = response.data.sort((a, b) => {
          const dataA = new Date(`${a.data}T${a.horario}`)
          const dataB = new Date(`${b.data}T${b.horario}`)
          return dataA.getTime() - dataB.getTime()
        })

        setServicos(servicosOrdenados)

        // Definir o próximo serviço (primeiro da lista ordenada)
        if (servicosOrdenados.length > 0) {
          setProximoServico(servicosOrdenados[0])
        }
      } else {
        console.warn("Usuário não autenticado")
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error)
      throw error
    }
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [])

  // Funções de navegação
  const handleSearchPress = () => {
    router.push("/passeio/Passeio")
  }

  const handlePasseadorPress = (passeador: Passeador) => {
    // router.push({
    //   pathname: "/passeador/[id]",
    //   params: { id: passeador.passeadorId },
    // })
  }

  const handleDicaPress = (dica: Dica) => {
    // router.push({
    //   pathname: "/dicas/[id]",
    //   params: { id: dica.id, titulo: dica.titulo },
    // })
  }

  const handleServicoPress = (servico: Servico) => {
    // router.push({
    //   pathname: "/servico/[id]",
    //   params: { id: servico.servicoId },
    // })
  }

  // Renderização de componentes
  const renderPasseadorItem = ({ item: passeador }: { item: Passeador }) => {
    const fotoUri = passeador.foto?.trim()
    const rating = passeador.avaliacao || 0

    return (
      <TouchableOpacity
        style={styles.passeadorCard}
        onPress={() => handlePasseadorPress(passeador)}
        activeOpacity={0.7}
      >
        <View style={styles.passeadorImageContainer}>
          <Image
            style={styles.passeadorImagem}
            source={fotoUri ? { uri: getFullImagePath(fotoUri) } : require("../../assets/images/cao-login.jpg")}
            onError={() => console.log(`Erro ao carregar imagem ${passeador.nome}`)}
          />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            <Ionicons name="star" size={12} color="#FFD700" />
          </View>
        </View>
        <Text style={styles.passeadorNome} numberOfLines={1}>
          {passeador.nome}
        </Text>
        <View style={styles.passeadorInfo}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.passeadorDistancia}>{passeador.distancia}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderDicaItem = ({ item }: { item: Dica }) => (
    <TouchableOpacity style={styles.dicaCard} onPress={() => handleDicaPress(item)} activeOpacity={0.8}>
      <Image style={styles.dicaImagem} source={item.imagem} />
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.dicaGradient}>
        <Text style={styles.dicaTitulo}>{item.titulo}</Text>
        <Text style={styles.dicaDescricao} numberOfLines={2}>
          {item.descricao}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )

  // Componente de carregamento
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    )
  }

  // Header animado
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: "clamp",
  })

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
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
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <Image style={styles.profileImage} source={require("../../assets/images/cao-login.jpg")} />
            <View>
              <Text style={styles.greeting}>Olá,</Text>
              <Text style={styles.userName}>{userName || "Amigo"}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="menu-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[styles.weatherWidget, { opacity: headerOpacity }]}>
          <Ionicons name={weather.icon as any} size={20} color="#FF9800" />
          <Text style={styles.weatherTemp}>{weather.temp}</Text>
          <Text style={styles.weatherText}>{weather.condition}</Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF7A00"]} tintColor="#FF7A00" />
        }
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Input de Busca */}
          <TouchableOpacity style={styles.searchInput} onPress={handleSearchPress} activeOpacity={0.8}>
            <Ionicons name="search-outline" size={22} color="#666" />
            <Text style={styles.searchText}>Buscar passeador ou serviço</Text>
          </TouchableOpacity>

          {/* Próximo Serviço (se existir) */}
          {proximoServico && (
            <TouchableOpacity
              style={styles.proximoServicoCard}
              onPress={() => handleServicoPress(proximoServico)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#FF9A3D", "#FF7A00"]}
                style={styles.servicoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.servicoHeader}>
                  <View style={styles.servicoIconContainer}>
                    <MaterialCommunityIcons name="dog-side" size={24} color="#FFF" />
                  </View>
                  <View style={styles.servicoInfo}>
                    <Text style={styles.servicoTitle}>Próximo Passeio</Text>
                    <Text style={styles.servicoDate}>
                      {proximoServico.data
                        ? new Date(proximoServico.data).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                          })
                        : "--/--"}{" "}
                      às {proximoServico.horario ? proximoServico.horario.substring(0, 5) : "00:00"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#FFF" />
                </View>
                <View style={styles.servicoDetails}>
                  <Text style={styles.servicoText}>
                    Passeio com{" "}
                    <Text style={styles.servicoHighlight}>{proximoServico.passeador?.nome || "Passeador"}</Text> para o
                    pet <Text style={styles.servicoHighlight}>{proximoServico.pet?.nome || "Pet"}</Text>
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Recomendações de Passeadores */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Walkers próximos de você</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={passeadores}
              keyExtractor={(item) => item.passeadorId.toString()}
              renderItem={renderPasseadorItem}
              contentContainerStyle={styles.passeadoresList}
              ListEmptyComponent={
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>Nenhum passeador disponível no momento</Text>
                </View>
              }
            />
          </View>

          {/* Dicas e Artigos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dicas e Artigos</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>Ver mais</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={dicas}
              keyExtractor={(item) => item.id}
              renderItem={renderDicaItem}
              contentContainerStyle={styles.dicasList}
            />
          </View>

          {/* Lembretes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Seus Lembretes</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>Adicionar</Text>
              </TouchableOpacity>
            </View>

            {lembretes.map((lembrete) => (
              <View key={lembrete.id} style={styles.lembreteCard}>
                <View style={styles.lembreteIconContainer}>
                  <Ionicons
                    name={lembrete.tarefa === "Vacinação" ? "medical-outline" : "paw-outline"}
                    size={20}
                    color="#FF7A00"
                  />
                </View>
                <View style={styles.lembreteInfo}>
                  <Text style={styles.lembreteTarefa}>
                    {lembrete.tarefa} - {lembrete.pet}
                  </Text>
                  <Text style={styles.lembreteData}>
                    {lembrete.data} {lembrete.horario && `às ${lembrete.horario}`}
                  </Text>
                </View>
                <TouchableOpacity style={styles.lembreteAction}>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* Botão flutuante para adicionar passeio */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleSearchPress} activeOpacity={0.9}>
        <LinearGradient colors={["#FF9A3D", "#FF7A00"]} style={styles.floatingButtonGradient}>
          <Ionicons name="add" size={24} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  )
}


