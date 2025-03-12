import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LoginButtonProps {
    onPress: () => void;
    loading: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onPress, loading }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={styles.buttonText}>Entrar</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginButton;