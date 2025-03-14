import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
      },
      header: {
        backgroundColor: "#FFF",
        paddingHorizontal: 20,
        paddingBottom: 16,
        justifyContent: "flex-end",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
        zIndex: 10,
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
      },
      content: {
        flex: 1,
      },
      filtersContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
      },
      filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: "#F0F0F0",
      },
      activeFilter: {
        backgroundColor: "#FF7A00",
      },
      filterText: {
        fontSize: 14,
        color: "#666",
      },
      activeFilterText: {
        color: "#FFF",
        fontWeight: "500",
      },
      scrollView: {
        flex: 1,
      },
      scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
      },
      servicoCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        marginTop: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        position: "relative",
      },
      canceledCard: {
        opacity: 0.7,
      },
      statusBadge: {
        position: "absolute",
        top: 16,
        right: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
      },
      statusText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "500",
        marginLeft: 4,
      },
      cardHeader: {
        marginBottom: 16,
      },
      servicoTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
      },
      servicoDate: {
        fontSize: 14,
        color: "#666",
      },
      cardContent: {
        marginBottom: 16,
      },
      infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
      },
      avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
        marginRight: 12,
        backgroundColor: "#F0F0F0",
      },
      avatar: {
        width: "100%",
        height: "100%",
      },
      infoContent: {
        flex: 1,
      },
      infoLabel: {
        fontSize: 12,
        color: "#666",
      },
      infoValue: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
      },
      cardActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
        paddingTop: 12,
      },
      actionButton: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 16,
      },
      actionText: {
        fontSize: 14,
        marginLeft: 4,
      },
      confirmDeleteContainer: {
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
        paddingTop: 12,
        alignItems: "center",
      },
      confirmText: {
        fontSize: 14,
        color: "#333",
        marginBottom: 8,
      },
      confirmButtons: {
        flexDirection: "row",
        justifyContent: "center",
      },
      confirmButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 8,
      },
      cancelButton: {
        backgroundColor: "#F0F0F0",
      },
      confirmDeleteButton: {
        backgroundColor: "#F44336",
      },
      confirmButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#FFF",
      },
      emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 20,
      },
      emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginTop: 16,
        marginBottom: 8,
      },
      emptyText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 24,
      },
      emptyButton: {
        width: "70%",
        height: 48,
        borderRadius: 24,
        overflow: "hidden",
      },
      emptyButtonGradient: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      },
      emptyButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
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