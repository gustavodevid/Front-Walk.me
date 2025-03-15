import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    logo: {
        width: 400,
        height: 400,
        borderRadius: 100,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#FF7A00',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupLink: {
        marginTop: 20,
        textAlign: 'center',
        color: '#007AFF',
    },
});

export default styles;