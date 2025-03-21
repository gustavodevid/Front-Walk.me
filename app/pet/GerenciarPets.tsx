import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CadastroPet from './CadastroPet'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import getFullImagePath from '../utils/utils';

interface Pet {
  petId: string;
  nome: string;
  raca: string;
  idade: number;
  tutorId: string;
  foto?: string | null;
}

export default function GerenciarPets() {
  const [modalVisible, setModalVisible] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
    
      if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }
      const response = await axios.get(`${config.API_URL}/pet/tutor/${userId}`);
      setPets(response.data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      Alert.alert('Erro', 'Erro ao buscar pets. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePetCadastrado = () => {
    setModalVisible(false);
    fetchPets(); 
  };

  const handleDeletePet = async () => {
    if (!selectedPet) return;

    try {
      await axios.delete(`${config.API_URL}/pet/${selectedPet.petId}`);
      Alert.alert('Sucesso', 'Pet excluído com sucesso!');
      setOptionsModalVisible(false);
      fetchPets();
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
      Alert.alert('Erro', 'Erro ao excluir pet. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando pets...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.petsHeader}>
          <Text style={styles.petsTitle}>Meus Pets</Text>
          <TouchableOpacity style={styles.addPetButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={32} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={pets}
          keyExtractor={(pet) => pet.petId}
          renderItem={({ item: pet }) => {
            const fotoUri = pet.foto?.trim();
            console.log(`Carregando imagem do pet ${pet.nome}:`, fotoUri);
            
            return (
              <TouchableOpacity onPress={() => { setSelectedPet(pet); setOptionsModalVisible(true); }}>
              <View style={styles.petCard}>
                <Image
                  style={styles.petImage}
                  source={fotoUri ? { uri: getFullImagePath(fotoUri) } : require('../../assets/images/cao-login.jpg')
                  }
                  onError={(error) => console.log(`Erro ao carregar imagem ${pet.nome}:`, error.nativeEvent)}
                />
                <Text style={styles.petNome}>{pet.nome}</Text>
              </View>
              </TouchableOpacity>
            );
          }}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CadastroPet onPetCadastrado={handlePetCadastrado} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}><Ionicons name="close-sharp" size={14} color="#fff"/></Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
        animationType="slide"
        transparent={true}
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedPet && (
              <>
                <Text style={styles.modalTitle}>{selectedPet.nome}</Text>
                <TouchableOpacity style={styles.optionButton} onPress={handleDeletePet}>
                  <Text style={styles.optionButtonText}>Excluir Pet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setOptionsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}><Ionicons name="close-sharp" size={14} color="#fff"  /></Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  petsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  petsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addPetButton: {
    padding: 10,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 18,
  },
  petNome: {
    fontSize: 18,
    color: '#333',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#FF6347',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  optionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
