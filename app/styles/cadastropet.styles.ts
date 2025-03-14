import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#F8F9FA",
    },
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
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
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
    },
    headerRight: {
      width: 40,
    },
    photoSection: {
      alignItems: "center",
      marginBottom: 24,
    },
    photoContainer: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: "#F0F0F0",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      marginBottom: 8,
      borderWidth: 2,
      borderColor: "#E0E0E0",
    },
    photoContainerError: {
      borderColor: "#F44336",
    },
    photoPreview: {
      width: "100%",
      height: "100%",
    },
    photoPlaceholder: {
      alignItems: "center",
      justifyContent: "center",
    },
    photoPlaceholderText: {
      marginTop: 8,
      fontSize: 14,
      color: "#999",
    },
    photoButtons: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 8,
    },
    photoButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginHorizontal: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    photoButtonText: {
      marginLeft: 8,
      color: "#333",
      fontWeight: "500",
    },
    formSection: {
      marginBottom: 24,
    },
    formGroup: {
      marginBottom: 16,
    },
    formRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    halfWidth: {
      width: "48%",
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: "#555",
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: "#E0E0E0",
    },
    inputContainerError: {
      borderColor: "#F44336",
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: "#333",
      marginLeft: 12,
    },
    textAreaContainer: {
      backgroundColor: "#FFF",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: "#E0E0E0",
    },
    textArea: {
      fontSize: 16,
      color: "#333",
      textAlignVertical: "top",
      minHeight: 100,
    },
    charCount: {
      fontSize: 12,
      color: "#999",
      textAlign: "right",
      marginTop: 4,
    },
    errorText: {
      color: "#F44336",
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    buttonContainerInline: {
      marginTop: 16,
      marginBottom: 24,
    },
    submitButton: {
      height: 56,
      borderRadius: 28,
      overflow: "hidden",
    },
    buttonGradient: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "#FFF",
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 8,
    },
  })

  export default styles;