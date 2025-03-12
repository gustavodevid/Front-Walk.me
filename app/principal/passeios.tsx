import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

interface Servico {
    servicoId: number;
    passeadorId: number;
    petId: number;
    data: string;
    horario: string;
    passeador: { nome: string };
    pet: { nome: string };
}

export default function MeusPasseios() {
    const insets = useSafeAreaInsets();
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchServicos = useCallback(async () => {
      setLoading(true); 
      try {
          const userId = await AsyncStorage.getItem('userId');
          if (userId) {
              const response = await axios.get<Servico[]>(`${config.API_URL}/servico/tutor/${userId}`);
              setServicos(response.data);
          } else {
              Alert.alert('Erro', 'Usuário não autenticado.');
          }
      } catch (error) {
          console.error('Erro ao buscar serviços:', error);
          Alert.alert('Erro', 'Erro ao buscar serviços.');
      } finally {
          setLoading(false); 
      }
      setRefreshing(false);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServicos();
  }, [fetchServicos]);

  useEffect(() => {
      fetchServicos();
  }, [fetchServicos]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <Text style={styles.title}>Meus Passeios</Text>

                {servicos.map((servico) => (
                    <View key={servico.servicoId} style={styles.servicoCard}>
                        <Text style={styles.servicoTitle}>Serviço #{servico.servicoId}</Text>
                        <Text style={styles.servicoText}>Passeador: {servico.passeador.nome}</Text>
                        <Text style={styles.servicoText}>Pet: {servico.pet.nome}</Text>
                        <Text style={styles.servicoText}>Data: {servico.data}</Text>
                        <Text style={styles.servicoText}>Horário: {servico.horario}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    servicoCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    servicoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    servicoText: {
        fontSize: 16,
        marginBottom: 5,
    },
});