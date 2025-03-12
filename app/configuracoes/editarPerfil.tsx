import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary, MediaType } from 'react-native-image-picker';
import axios from 'axios';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export default function EditarPerfil() {
    const insets = useSafeAreaInsets();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
      const fetchUserId = async () => {
          try {
              const storedUserId = await AsyncStorage.getItem('userId');
              if (storedUserId) {
                  setUserId(storedUserId);
              }
          } catch (error) {
              console.error('Erro ao recuperar o ID do usuário:', error);
          }
      };

      fetchUserId();
  }, []);

  const escolherFoto = async () => {
      let resultado = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
      });

      if (!resultado.canceled) {
          setProfileImage(resultado.assets[0].uri);
      }
  };

  const atualizarFoto = async () => {
      if (!profileImage || !userId) {
          Alert.alert('Erro', 'Selecione uma foto e verifique se o usuário está autenticado.');
          return;
      }

      try {
          const formData = new FormData();
          formData.append('foto', {
              uri: profileImage,
              type: 'image/jpeg',
              name: `profile-${Date.now()}.jpg`,
          });
          const response = await axios.put(`${config.API_URL}/tutor/${userId}`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });

          console.log('Foto atualizada com sucesso:', response.data);
          Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
          router.push('/principal/perfil')
      } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log('Axios Error Response:', error.response); 
        }
          Alert.alert('Erro', 'Erro ao atualizar foto. Tente novamente.');
      }
  };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={escolherFoto}>
                    <Image style={styles.profileImage} source={profileImage ? { uri: profileImage } : require('../../assets/images/cao-login.jpg')} />
                </TouchableOpacity>
                <Text style={styles.profileName}>Editar Foto</Text>
            </View>

            <View style={styles.profileContent}>
                <TouchableOpacity style={styles.saveButton} onPress={atualizarFoto}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
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
    marginBottom: 10,
  },
  profileContent: {
    padding: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});