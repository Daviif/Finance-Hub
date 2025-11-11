import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiLogin } from '../api/ApiService'; 

// 1. Importe os estilos do arquivo separado
import styles from './style/index.styles'; 

export default function LoginScreen() {
  const router = useRouter(); 
  const [email, setEmail] = useState<string>('dev@email.com');
  const [senha, setSenha] = useState<string>('123');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    // ... (toda a lógica de login permanece a mesma) ...
    if (loading) return; 
    setLoading(true);
    try {
      const response = await apiLogin(email, senha);
      console.log('Login bem-sucedido!', response.token);
      router.replace('/Dashboard'); 
    } catch (error: any) {
      console.error('Erro no login:', error.message);
      Alert.alert('Erro no Login', error.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    // 2. Use os estilos importados (nada muda aqui)
    <SafeAreaView style={styles.container}> 
        <View style={styles.loginBox}>
            <Text style={styles.title}>Bem-Vindo ao Finance Hub</Text>
            <Text style={styles.subtitle}>Por favor, faça seu login</Text>
      
            <TextInput
                style={styles.input}
                placeholder="Email"
                // ... (props)
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                // ... (props)
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0a0a2cff" />
            ) : (
                <View style={styles.buttonContainer}>
                <Button title="Entrar" onPress={handleLogin} />
                </View>
            )}

            <View style={styles.buttonContainer}>
                <Button
                title="Precisa de uma conta? Cadastre-se"
                onPress={() => router.push('/Register')}
                color="#888" 
                />
            </View>
        </View>
    </SafeAreaView>
  );
}

// Note como o StyleSheet.create() sumiu daqui,
// deixando o arquivo focado apenas no componente.