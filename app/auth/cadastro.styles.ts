import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'left',
        paddingHorizontal: 20,
        marginTop: 20,
      },
      description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20, 
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        alignSelf: 'flex-start',
      },
      input: {
        height: 50,
        width:'100%',
        backgroundColor: '#f0f0f0', // Cor de fundo sutil
        borderRadius: 10,
      
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        shadowColor: '#000', // Sombra
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2, // Para Android
      },
      button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2, 
        width:'100%',
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      link: {
        marginTop: 20,
        textAlign: 'center',
        color: 'blue',
        fontSize: 16,
      },
      imagePicker: {
        backgroundColor: '#e6f7ff',
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#b3e0ff',
    },
    imagePickerText: {
        fontSize: 16,
        color: '#007bff',
    },
    imagePreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        alignSelf: 'center',
    },
    });

    export default styles;