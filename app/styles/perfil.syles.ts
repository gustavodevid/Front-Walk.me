import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8F9FA",
    },
    content: {
      flex: 1,
    },
    header: {
      paddingBottom: 24,
    },
    headerContent: {
      alignItems: "center",
      paddingHorizontal: 20,
    },
    profileImageContainer: {
      position: "relative",
      marginBottom: 16,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: "rgba(255, 255, 255, 0.8)",
    },
    editBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#FF7A00",
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#FFF",
    },
    profileName: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#FFF",
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: 20,
    },
    statsContainer: {
      flexDirection: "row",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      width: "100%",
      justifyContent: "space-between",
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFF",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.8)",
    },
    statDivider: {
      width: 1,
      height: "80%",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 16,
      marginLeft: 4,
    },
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    optionIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
      marginBottom: 2,
    },
    optionDescription: {
      fontSize: 13,
      color: "#666",
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFF",
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 32,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: "500",
      color: "#F44336",
      marginLeft: 8,
    },
    versionText: {
      fontSize: 12,
      color: "#999",
      textAlign: "center",
      marginBottom: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F8F9FA",
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: "#666",
    },
  })

  export default styles;