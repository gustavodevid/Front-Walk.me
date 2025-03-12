import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import  styles  from './cadastro.styles';
import config from '../../config';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleCadastro = async () => {
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        router.push('/auth/login');
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.message || 'Erro ao cadastrar.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
      <Text style={styles.title}>Primeiro, precisamos conhecer você.</Text>
      <Text style={styles.description}>
          Depois, gostarámos de conhecer o seu pet.
      </Text>
      <Text style={styles.label}>Seu Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome completo"
        value={nome}
        onChangeText={setNome}
        />
      <Text style={styles.label}>Seu Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira um email válido"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        />
      <Text style={styles.label}>Escolha uma senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite uma senha forte"
        value={senha}
        onChangeText={setSenha}
        autoCapitalize="none"
        secureTextEntry
        />
      <TextInput
        style={styles.input}
        placeholder="Repita sua senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        autoCapitalize="none"
        secureTextEntry
        />
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
        </SafeAreaView>
  );
}