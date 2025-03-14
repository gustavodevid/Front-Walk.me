import { StyleSheet } from 'react-native';

const styles = {
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: "center",
    },
    imageContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    logo: {
      width: 150,
      height: 150,
      borderRadius: 75,
    },
    formContainer: {
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginBottom: 24,
    },
    inputWrapper: {
      marginBottom: 16,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 12,
      paddingHorizontal: 12,
      backgroundColor: "#F8F8F8",
      height: 56,
    },
    inputError: {
      borderColor: "#FF3B30",
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: "#333",
      height: "100%",
    },
    passwordToggle: {
      padding: 8,
    },
    errorText: {
      color: "#FF3B30",
      fontSize: 12,
      marginTop: 4,
      marginLeft: 12,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 24,
    },
    forgotPasswordText: {
      color: "#FF7A00",
      fontSize: 14,
    },
    loginButton: {
      height: 56,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 16,
    },
    gradient: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loginButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: "#E0E0E0",
    },
    dividerText: {
      color: "#888",
      paddingHorizontal: 10,
      fontSize: 14,
    },
    signupButton: {
      height: 56,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#FF7A00",
      justifyContent: "center",
      alignItems: "center",
    },
    signupButtonText: {
      color: "#FF7A00",
      fontSize: 16,
      fontWeight: "bold",
    },
  }

export default styles;