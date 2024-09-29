import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
    formSection: {
        flex: 1,
        width: '90%',
        height: '100%',
        margin: 'auto',
        justifyContent: 'space-around',
        paddingVertical: 60
    },

    fieldContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 12,
        gap: 8
    },

    menu: {
        flex: .5,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },

    menuItem: {
        width: '45%'
    }
});