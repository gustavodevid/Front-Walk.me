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

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Raça"
        value={raca}
        onChangeText={setRaca}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={escolherFoto}>
        <Text style={styles.imagePickerText}>Selecionar Foto</Text>
      </TouchableOpacity>

      {foto && <Image source={{ uri: foto }} style={styles.imagePreview} />}

      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={cadastrarPet}>
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
    color: '#333', // Cor mais suave
    textAlign: 'center', // Centralizar o título
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd', // Cor da borda mais suave
    padding: 15, // Aumentar o padding para melhor toque
    marginBottom: 15, // Aumentar a margem para melhor espaçamento
    borderRadius: 8, // Bordas arredondadas
    backgroundColor: '#f9f9f9', // Fundo levemente cinza
    fontSize: 16,
    color: '#333',
  },
  imagePicker: {
    backgroundColor: '#e6f7ff', // Cor de fundo mais suave
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3e0ff', // Cor da borda correspondente
  },
  imagePickerText: {
    fontSize: 16,
    color: '#007bff', // Cor do texto mais visível
  },
  imagePreview: {
    width: 120, // Aumentar o tamanho da pré-visualização
    height: 120,
    borderRadius: 60, // Tornar circular
    marginBottom: 20,
    alignSelf: 'center', // Centralizar a imagem
  },
  button: {
    backgroundColor: '#007bff', // Cor do botão mais moderna
    padding: 18, // Aumentar o padding
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000', // Adicionar sombra para profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18, // Aumentar o tamanho do texto
    fontWeight: '600', // Peso da fonte mais forte
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12, // Bordas arredondadas para o modal
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%', // Largura relativa para melhor responsividade
  },
  closeButton: {
    backgroundColor: '#ccc', // Cor do botão de fechar mais neutra
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    width: '40%', // Largura relativa para o botão de fechar
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CadastroPet;