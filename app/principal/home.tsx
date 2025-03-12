import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import styles from '../styles/home.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import Passeio from '../passeio/Passeio';
import { router } from 'expo-router';
import getFullImagePath from '../utils/utils';

interface Passeador {
  passeadorId: string;
  nome: string;
  email: string;
  avaliacao: number;
  foto?: string | null;
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState<string | null>(null);
  const [passeadores, setPasseadores] = useState<Passeador[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
          setLoading(true);
          await fetchUserName();
          await fetchPasseadores();
      } catch (error) {
          console.error('Erro ao buscar dados:', error);
          Alert.alert('Erro', 'Erro ao buscar dados. Tente novamente.');
      } finally {
          setLoading(false);
          setRefreshing(false);
      }
  };

    const fetchUserName = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        if (storedUserName) {
          setUserName(storedUserName);
        }
      } catch (error) {
        console.error('Erro ao recuperar o nome do usuário:', error);
      }
    };

    const fetchPasseadores = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/passeador`);
        const passeadoresComFoto = await Promise.all(response.data.map(async (passeador: any) => {
            try {
                const passeadorDetalhes = await axios.get(`${config.API_URL}/passeador/${passeador.passeadorId}`);
                return {
                    ...passeador,
                    foto: passeadorDetalhes.data.foto,
                };
            } catch (error) {
                console.error(`Erro ao buscar detalhes do passeador ${passeador.passeadorId}:`, error);
                return {
                    ...passeador,
                    foto: null,
                };
            }
        }));
        setPasseadores(passeadoresComFoto);
    } catch (error) {
        console.error('Erro ao buscar passeadores:', error);
        Alert.alert('Erro', 'Erro ao buscar passeadores.');
    }
  };
  

  const dicas = [
    { id: '1', titulo: 'Treinando seu pet', imagem: require('../../assets/images/cao-login.jpg') },
    { id: '2', titulo: 'Cuidados com a saúde', imagem: require('../../assets/images/cao-login.jpg') },
  ];

  const atividades = [
    { id: '1', tipo: 'Passeio', pet: 'Rex', passeador: 'João', imagem: require('../../assets/images/cao-login.jpg') },
  ];

  const lembretes = [
    { id: '1', tarefa: 'Vacinação', pet: 'Rex', data: '28/02/2025' },
    { id: '2', tarefa: 'Passeio', pet: 'Luna', data: '28/02/2025' },
  ];

  const handleSearchPress = () => {
    router.push('/passeio/Passeio'); 
};

const onRefresh = useCallback(() => {
  setRefreshing(true);
  fetchData();
}, []);

if (loading) {
  return (
      <View style={styles.loadingContainer}>
          <Text>Carregando passeadores...</Text>
      </View>
  );
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <Image style={styles.profileImage} source={require()} /> */}
        <Text style={styles.userName}>Olá, {userName || '[Nome do Usuário]'}</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>

       {/* Input de Busca */}
      <TouchableOpacity style={styles.searchInput} onPress={handleSearchPress}>
                    <Ionicons name="search-outline" size={24} color="gray" />
                    <Text style={styles.searchText}>Buscar Passeio</Text>
                </TouchableOpacity>
        {/* Feed de Atividades */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividades Recentes</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={atividades}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.atividadeCard}>
                <Image style={styles.atividadeImagem} source={item.imagem} />
                <Text style={styles.atividadeTipo}>{item.tipo}</Text>
                {item.pet && <Text style={styles.atividadeDetalhe}>Pet: {item.pet}</Text>}
                {item.passeador && <Text style={styles.atividadeDetalhe}>Passeador: {item.passeador}</Text>}
                {item.local && <Text style={styles.atividadeDetalhe}>Local: {item.local}</Text>}
              </View>
            )}
          />
        </View> */}
        

         {/* Recomendações de Passeadores */}
         <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Passeadores Próximos</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={passeadores}
                        keyExtractor={(item) => item.passeadorId.toString()}
                        renderItem={({ item: passeador }) => {
                            const fotoUri = passeador.foto?.trim();
                            console.log(`Carregando imagem do passeador ${passeador.nome}:`, fotoUri);
                            console.log('Dados do passeador:', passeador);
                            return (
                                <View style={styles.passeadorCard}>
                                    <Image
                                        style={styles.passeadorImagem}
                                        source={fotoUri ? { uri: getFullImagePath(fotoUri) } : require('../../assets/images/cao-login.jpg')}
                                        onError={(error) => console.log(`Erro ao carregar imagem ${passeador.nome}:`, error.nativeEvent)}
                                    />
                                    <Text style={styles.passeadorNome}>{passeador.nome}</Text>
                                    <Text style={styles.passeadorDistancia}>{passeador.avaliacao}</Text>
                                </View>
                            );
                        }}
                    />
                    <TouchableOpacity style={styles.verTodosButton}>
                        <Text style={styles.verTodosText}>Ver Todos</Text>
                    </TouchableOpacity>
                </View>

        
    {/* Dicas e Artigos */}
    {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dicas e Artigos</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={dicas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dicaCard}>
                <Image style={styles.dicaImagem} source={item.imagem} />
                <Text style={styles.dicaTitulo}>{item.titulo}</Text>
              </TouchableOpacity>
            )}
          />
        </View> */}
        {/* Widget de Previsão do Tempo
        <View style={styles.weatherWidget}>
          <Ionicons name="partly-sunny-outline" size={32} color="#FF9800" />
          <Text style={styles.weatherTemp}>35°C</Text>
          <Text style={styles.weatherText}>Ensolarado</Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

