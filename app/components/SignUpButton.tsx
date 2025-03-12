import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={[styles.signupLink]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    signupLink: {
        marginTop: 20,
        textAlign: 'center',
        color: '#007AFF',
    },
});

export default Button;