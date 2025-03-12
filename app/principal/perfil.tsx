import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList, Modal, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CadastroPet from '../pet/CadastroPet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import getFullImagePath from '../utils/utils';

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a exibição do modal
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        const storedUserEmail = await AsyncStorage.getItem('userEmail');
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserName) {
          setUserName(storedUserName);
        }
        if (storedUserEmail) {
          setUserEmail(storedUserEmail);
        }
        if (storedUserId) {
          await fetchUserPhoto(storedUserId); 
      }
      } catch (error) {
        console.error('Erro ao recuperar o nome do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchUserPhoto = async (userId: string) => {
    try {
        const response = await axios.get(`${config.API_URL}/tutor/${userId}`);
        if (response.data && response.data.foto) {
            setFotoUri(response.data.foto);
        }
    } catch (error) {
        console.error('Erro ao buscar foto do usuário:', error);
    }
};

  const handleEditarPerfil = () => {
    router.push('/configuracoes/editarPerfil');
  };

  const handleGerenciarPets = () => {
    router.push('/pet/GerenciarPets');
  };

  const handleLogout = async () => {
    try {
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userName');
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('token');
        router.push('/auth/login');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
    }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleEditarPerfil}>  
            <Image style={styles.profileImage} source={fotoUri ? { uri: getFullImagePath(fotoUri) } : require('../../assets/images/cao-login.jpg')
                  } />
          </TouchableOpacity>
          <Text style={styles.profileName}>{userName || '[Nome do Usuário]'}</Text>
          <Text style={styles.profileEmail}>{userEmail || '[Nome do Usuário]'}</Text>
        </View>

        <View style={styles.profileContent}>

          {/* <TouchableOpacity style={styles.profileOption}>
            <Ionicons name="settings-outline" size={24} color="#007AFF" style={styles.optionIcon} />
            <Text style={styles.profileOptionText}>Configurações</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.profileOption} onPress={handleGerenciarPets}>
            <Ionicons name="paw-outline" size={24} color="#007AFF" style={styles.optionIcon} />
            <Text style={styles.profileOptionText}>Gerenciar Pets</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileOption}>
            <Ionicons name="time-outline" size={24} color="#007AFF" style={styles.optionIcon} />
            <Text style={styles.profileOptionText}>Histórico de Passeios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileOption} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#FF6347" style={styles.optionIcon} />
                        <Text style={styles.profileOptionText}>Sair</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  profileInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  profileBio: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  profileContent: {
    padding: 20,
  },
  profileOption: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileOptionText: {
    fontSize: 18,
    marginLeft: 10,
  },
  optionIcon: {
    width: 24,
  },
  petsSection: {
    padding: 20,
  },
  petsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  petCard: {
    marginRight: 10,
    alignItems: 'center',
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  petNome: {
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});