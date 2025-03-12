import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Alert,
    Modal,
    TextInput,
    Platform,
    Image, 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import config from '../../config';
import customMap from '../../assets/maps/customMap.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Geometry } from 'geojson';
import getFullImagePath from '../utils/utils';
import styles from './passeio.styles';
interface Passeador {
    passeadorId: string;
    nome: string;
    latitude: string;
    longitude: string;
    foto?: string;
}

interface Pet {
  petId: string;
  nome: string;
  raca: string;
}

interface Servico {
  passeadorId: string;
  petId: string;
  tutorId: string;
  dataServico: Date;
  localizacaoServico: Geometry;
  tipoServico: 'passeio'

}

export default function Passeios() {
    const insets = useSafeAreaInsets();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [passeadores, setPasseadores] = useState<Passeador[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPasseador, setSelectedPasseador] = useState<Passeador | null>(null);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null); 
    const [selectedTime, setSelectedTime] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [showPetModal, setShowPetModal] = useState<boolean>(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [tutorFotoUri, setTutorFotoUri] = useState<string | null>(null);
    const defaultImage = require('../../assets/images/cao-login.jpg');

    useEffect(() => {
      fetchData();
      const getUserPhoto = async () => {
          const userId = await AsyncStorage.getItem('userId');
          if (userId) {
              fetchUserPhoto(userId);
          }
      };
      getUserPhoto();
  }, []);

    const fetchData = async () => {
          try {
              setLoading(true);
              await fetchPasseadores();
          } catch (error) {
              console.error('Erro ao buscar dados:', error);
              Alert.alert('Erro', 'Erro ao buscar dados. Tente novamente.');
          } finally {
              setLoading(false);
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

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar a localização foi negada');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const fetchUserPhoto = async (userId: string) => {
      try {
          const response = await axios.get(`${config.API_URL}/tutor/${userId}`);
          if (response.data && response.data.foto) {
              setTutorFotoUri(response.data.foto);
          }
      } catch (error) {
          console.error('Erro ao buscar foto do usuário:', error);
      }
  };

    const handleMarkerPress = (passeador: Passeador) => {
        setSelectedPasseador(passeador);
    };

    const handleProporPasseio = async () => {
      if (selectedPasseador && selectedPet) {
        try {
            const userId = await AsyncStorage.getItem('userId'); 
            
            if (!userId) {
                Alert.alert('Erro', 'Usuário não autenticado.');
                return;
            }

            const servico: Servico = {
                passeadorId: selectedPasseador.passeadorId,
                petId: selectedPet.petId,
                tutorId: userId, 
                dataServico: selectedDate,
                localizacaoServico: {
                  type: 'Point',
                  coordinates: [location.coords.longitude, location.coords.latitude],
              },
              tipoServico: 'passeio',
            };
            
            Alert.alert(
                'Propor Passeio',
                `Deseja propor um passeio para ${selectedPet.nome} com ${selectedPasseador.nome}?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Sim',
                        onPress: () =>
                            cadastrarServicoPasseio(servico, () => {
                                setSelectedPasseador(null);
                            }),
                    },
                ]
            );
            setSelectedPasseador(null);
        } catch (error) {
            console.error('Erro ao buscar userId:', error);
            Alert.alert('Erro', 'Erro ao buscar informações do usuário.');
        }
    }
    };
  
    const cadastrarServicoPasseio = async (servico: Servico, onServicoCadastrado: () => void) => {
      if (!servico.passeadorId || !servico.tutorId || !servico.petId || !servico.dataServico) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
      }
      
      try {
        const response = await axios.post(`${config.API_URL}/servico`, servico);
    
        console.log('Serviço de passeio cadastrado com sucesso:', response.data);
        Alert.alert('Sucesso', 'Serviço de passeio cadastrado com sucesso!');
        router.push('/principal/passeios');
        onServicoCadastrado(); 
      } catch (error) {
        console.error('Erro ao cadastrar serviço de passeio:', error);
        Alert.alert('Erro', 'Erro ao cadastrar serviço de passeio. Tente novamente.');
      }
    };

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

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
      if (selectedDate) {
          setDate(selectedDate);
          setSelectedDate(selectedDate);
          setShowDatePicker(false);
      }
  };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Buscar Passeio</Text>

                {location && (
                    <MapView
                        style={styles.map}
                        customMapStyle={customMap}
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        <Marker coordinate={location.coords} title="Minha Localização">
                        <View style={[styles.markerWrapper, styles.userMarkerWrapper]}>
                          <Image
                            source={tutorFotoUri ? {uri: getFullImagePath(tutorFotoUri) } : defaultImage}
                            style={styles.markerImage} 
                          />
                         </View>
                         <View style={[styles.markerPointer, styles.userMarkerPointer]} />
                        </Marker>
                        
                        {passeadores.map((passeador) => (
                            <Marker
                                key={passeador.passeadorId}
                                coordinate={{
                                    latitude: parseFloat(passeador.latitude),
                                    longitude: parseFloat(passeador.longitude),
                                }}
                                title={passeador.nome}
                                onPress={() => handleMarkerPress(passeador)}
                            >
                              <View style={[styles.markerWrapper, styles.userMarkerWrapper]}>
                                <Image 
                                  source={passeador.foto ? {uri: getFullImagePath(passeador.foto)  } : defaultImage}
                                  style={styles.markerImage} 
                                  onError={(e) => console.log(`Erro ao carregar imagem do passeador ${passeador.nome}:`, e.nativeEvent.error)}
                                />
                              <View style={styles.markerPointer} />
                              </View>
                            </Marker>
                        ))}
                    </MapView>
                )}

            </ScrollView>
            <Modal visible={selectedPasseador !== null} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedPasseador && (
                            <>
                                <Text style={styles.modalTitle}>{selectedPasseador.nome}</Text>

                                <TouchableOpacity style={styles.input} onPress={() => {
                                    setShowPetModal(true);
                                    fetchPets();
                                }}>
                                    <Text>{selectedPet ? selectedPet.nome : 'Selecione o Pet'}</Text>
                                </TouchableOpacity>

                               <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                </TouchableOpacity>

                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
    <Text>{selectedDate ? selectedDate.toLocaleDateString() : 'Selecione a Data'}</Text>
</TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                                <TouchableOpacity style={styles.modalButton} onPress={handleProporPasseio}>
                                    <Text style={styles.modalButtonText}>Propor Passeio</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedPasseador(null)}>
                                    <Text style={styles.modalCloseButtonText}>Fechar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal visible={showPetModal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowPetModal(false)}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                        {pets.map((pet) => (
                            <TouchableOpacity key={pet.petId} style={styles.petItem} onPress={() => {
                                setSelectedPet(pet);
                                setShowPetModal(false);
                            }}>
                                <Text>{pet.nome}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

