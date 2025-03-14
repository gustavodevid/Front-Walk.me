import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import FormData from 'form-data';
import { Ionicons } from '@expo/vector-icons';

interface CadastroPetProps {
  onPetCadastrado: () => void; 
}

const CadastroPet: React.FC<CadastroPetProps> = ({ onPetCadastrado }) => {
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [idade, setIdade] = useState('');
  const [tutorId, setTutorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setTutorId(storedUserId);
        }
      } catch (error) {
        console.error('Erro ao recuperar o ID do dono:', error);
      }
    };

    fetchTutorId();
  }, []);

  const escolherFoto = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const cadastrarPet = async () => {
    if (!nome || !raca || !foto || !idade || !tutorId) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('raca', raca);
        formData.append('idade', parseInt(idade));
        formData.append('tutorId', tutorId);
        
        if (foto) {
          formData.append('foto', {
            uri: foto,
            type: 'image/jpeg',
            name: `pet-${Date.now()}.jpg`,
          });
        }

        const response = await axios.post(`${config.API_URL}/pet`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Pet cadastrado com sucesso:', response.data);
        Alert.alert('Sucesso', 'Pet cadastrado com sucesso!');
        onPetCadastrado();
    } catch (error) {
        console.error('Erro ao cadastrar pet:', error);
        Alert.alert('Erro', 'Erro ao cadastrar pet. Tente novamente.');
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Pet</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="paw-outline" size={24} color="#007bff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="paw-outline" size={24} color="#007bff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Raça"
          value={raca}
          onChangeText={setRaca}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={24} color="#007bff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Idade"
          value={idade}
          onChangeText={setIdade}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.imagePicker} onPress={escolherFoto}>
        <Ionicons name="camera-outline" size={24} color="#007bff" style={styles.imagePickerIcon} />
        <Text style={styles.imagePickerText}>Selecionar Foto</Text>
      </TouchableOpacity>

      {foto && <Image source={{ uri: foto }} style={styles.imagePreview} />}


      <TouchableOpacity style={styles.button} onPress={cadastrarPet}>
        <Ionicons name="checkmark-circle-outline" size={24} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  inputIcon: {
    marginRight: 5,
  },
  imagePicker: {
    flexDirection: 'row',
    backgroundColor: '#e6f7ff',
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3e0ff',
    justifyContent: 'center',
  },
  imagePickerText: {
    fontSize: 16,
    color: '#007bff',
    marginLeft: 10,
  },
  imagePickerIcon: {
    marginRight: 5,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 5,
  },

});

export default CadastroPet;
