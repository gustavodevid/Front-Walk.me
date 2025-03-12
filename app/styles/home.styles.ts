import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      justifyContent: 'space-between',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
      flex: 1,
      marginLeft: 10,
    },
    notificationIcon: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    cardText: {
      fontSize: 16,
      marginBottom: 5,
    },
    cardButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignSelf: 'flex-start',
      marginTop: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    cardButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    passeadorCard: {
      marginRight: 10,
      alignItems: 'center',
    },
    passeadorImagem: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 5,
    },
    passeadorNome: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    passeadorAvaliacao: {
      fontSize: 14,
      color: 'gray',
    },
    passeadorDistancia: {
      fontSize: 14,
      color: 'gray',
    },
    verTodosButton: {
      marginTop: 10,
      alignSelf: 'flex-end',
    },
    verTodosText: {
      color: '#007AFF',
    },
    weatherWidget: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    weatherTemp: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    weatherText: {
      fontSize: 16,
      color: 'gray',
    },
    atividadeCard: {
      marginRight: 10,
      alignItems: 'center',
    },
    atividadeImagem: {
      width: 100,
      height: 80,
      borderRadius: 8,
      marginBottom: 5,
    },
    atividadeTipo: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    atividadeDetalhe: {
      fontSize: 12,
      color: 'gray',
    },
    dicaCard: {
      marginRight: 10,
      alignItems: 'center',
    },
    dicaImagem: {
      width: 120,
      height: 80,
      borderRadius: 8,
      marginBottom: 5,
    },
    dicaTitulo: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    widget: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    widgetTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    lembreteItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    lembreteTarefa: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    lembreteDetalhe: {
      fontSize: 14,
      color: 'gray',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '90%',
    },
    closeButton: {
      backgroundColor: '#2196F3',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop: 15,
    },
    closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    searchInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
  },
  searchText: {
      marginLeft: 10,
      color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
  });

  export default styles;