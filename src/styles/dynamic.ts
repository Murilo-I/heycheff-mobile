import { StyleSheet } from "react-native";

export const dynamicStyles = StyleSheet.create({
    container: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginBottom: 8,
        padding: 12,
        width: '100%',
    },
    removeButton: {
        marginTop: 8,
        alignSelf: 'flex-end',
    },
    thumbnail: {
        height: '100%',
        borderRadius: 8,
    },
    imgPointer: {
        position: 'absolute',
        alignSelf: 'center',
        marginTop: 80,
        zIndex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        marginBottom: 2,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    actions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    iconButton: {
        padding: 8,
    },
    dragList: {
        flexGrow: 1,
        maxHeight: 175
    }
});