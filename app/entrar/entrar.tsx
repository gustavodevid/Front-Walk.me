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
import styles from './entrar.styles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SignUpButton from '../components/SignUpButton';
import LoginButton from '../components/LoginButton';
import  loginTutor  from '../services/api/auth/LoginTutor';
import { storeData } from '../utils/Storage/StoreData';
import AuthCheck from '../components/AuthCheck';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEntrar = async () => {
        router.push('/components/AuthCheck')
    };

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image style={styles.logo} source={require('../../assets/images/logo.jpeg')} />
                </View>
                <View style={styles.formContainer}>
                    <LoginButton onPress={handleEntrar} loading={loading}  />
                </View>
        </SafeAreaView>
    );
}