import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF",
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      zIndex: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#F0F0F0",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    headerRight: {
      width: 40,
    },
    map: {
      flex: 1,
    },
    markerWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#FFF",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#FF7A00",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 4,
    },
    selectedMarkerWrapper: {
      borderColor: "#4CAF50",
      transform: [{ scale: 1.1 }],
    },
    userMarkerWrapper: {
      borderColor: "#2196F3",
    },
    markerImage: {
      width: 34,
      height: 34,
      borderRadius: 17,
    },
    markerPointer: {
      width: 10,
      height: 10,
      backgroundColor: "#FF7A00",
      borderRadius: 5,
      transform: [{ rotate: "45deg" }],
      marginTop: -5,
      alignSelf: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    selectedMarkerPointer: {
      backgroundColor: "#4CAF50",
    },
    userMarkerPointer: {
      backgroundColor: "#2196F3",
    },
    markerBadge: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: "#4CAF50",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#FFF",
    },
    passeadorCard: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#FFF",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    passeadorCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    passeadorInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    passeadorCardImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    passeadorCardName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    passeadorCardRating: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    passeadorCardRatingText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#333",
      marginLeft: 4,
    },
    passeadorCardDistance: {
      fontSize: 14,
      color: "#666",
      marginLeft: 4,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#F0F0F0",
      justifyContent: "center",
      alignItems: "center",
    },
    formContainer: {
      marginVertical: 16,
    },
    formField: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F8F8F8",
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    },
    formIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255, 122, 0, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    formFieldContent: {
      flex: 1,
    },
    formLabel: {
      fontSize: 12,
      color: "#666",
    },
    formValue: {
      fontSize: 16,
      color: "#333",
      fontWeight: "500",
    },
    proposeButton: {
      height: 50,
      borderRadius: 12,
      overflow: "hidden",
    },
    proposeButtonGradient: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    proposeButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFF",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "#FFF",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    modalCloseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#F0F0F0",
      justifyContent: "center",
      alignItems: "center",
    },
    petList: {
      maxHeight: 400,
    },
    petItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F8F8F8",
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    },
    selectedPetItem: {
      backgroundColor: "rgba(255, 122, 0, 0.1)",
      borderWidth: 1,
      borderColor: "#FF7A00",
    },
    petImageContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: "hidden",
      marginRight: 12,
    },
    petImage: {
      width: "100%",
      height: "100%",
    },
    petInfo: {
      flex: 1,
    },
    petName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    petRaca: {
      fontSize: 14,
      color: "#666",
    },
    petSelectedIcon: {
      marginLeft: 8,
    },
    emptyPetContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    emptyPetText: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginTop: 12,
      marginBottom: 16,
    },
    addPetButton: {
      backgroundColor: "#FF7A00",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    addPetButtonText: {
      color: "#FFF",
      fontWeight: "bold",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFF",
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: "#666",
    },
});

  export default styles;