import { StyleSheet } from "react-native";

export const formsStyles = StyleSheet.create({
    bottomContainer: {
        flex: 1,
        gap: 12,
        marginTop: -42,
        paddingTop: 12,
        paddingHorizontal: 24,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28
    },

    itemBox: {
        elevation: 2,
        shadowColor: '#171717',
        marginBottom: 12
    },

    dropdown: {
        height: 48,
        backgroundColor: 'transparent',
        borderBottomColor: 'gray',
        borderBottomWidth: .5
    }
});