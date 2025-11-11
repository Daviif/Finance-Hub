import React from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Bem-vindo ao seu Painel!</Text>
      <Button 
        title="Sair (Voltar para Login)"
        onPress={() => router.replace('/')} 
      />
    </SafeAreaView>
  );
}