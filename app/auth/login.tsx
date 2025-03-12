import React, { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './login.styles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SignUpButton from '../components/SignUpButton';
import LoginButton from '../components/LoginButton';
import  loginTutor  from '../services/apis/auth/LoginTutor';
import { storeData } from '../utils/Storage/StoreData';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await loginTutor(email, senha);

            if (response.data.token) {
                const { token, userName, userEmail, userId } = response.data;
                await storeData('token', token);
                await storeData('userName', userName);
                await storeData('userEmail', userEmail);
                await storeData('userId', userId);
                router.push('/principal/home');
            } else {
                Alert.alert('Erro', 'Login falhou. Verifique suas credenciais.');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            Alert.alert('Erro ao conectar com o servidor.');
        }  finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                >
                <View style={styles.imageContainer}>
                    <Image style={styles.logo} source={require('../../assets/images/cao-login.jpg')} />
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Au-Au! (Olá)</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="email-outline" size={24} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            />
                    </View>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock-outline" size={24} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry
                            autoCapitalize="none"
                            />
                    </View>

                    <LoginButton onPress={handleLogin} loading={loading}  />

                    <SignUpButton title="Crie sua conta" onPress={() => router.push('/auth/cadastro')} />
                
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}