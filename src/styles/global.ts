import { StyleSheet } from "react-native"

import { colors } from "./colors";
import { fontFamily } from "./fontFamily";

export const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    flexInitial: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 4
    },

    flexRow: {
        flexDirection: 'row'
    },

    flexColumn: {
        flexDirection: 'column'
    },

    flexWrap: {
        flexWrap: 'wrap'
    },

    gap8: {
        gap: 8
    },

    gap16: {
        gap:16
    },

    justifyCenter: {
        justifyContent: 'center'
    },

    justifyEnd: {
        justifyContent: 'flex-end'
    },

    justifyAround: {
        justifyContent: 'space-around'
    },

    contentBetween: {
        alignContent: 'space-between'
    },

    absolute: {
        position: 'absolute'
    },

    card: {
        flex: 1,
        margin: 8,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.rose[200],
        borderRadius: 8
    },

    cardImage: {
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#AAA'
    },

    cardTitle: {
        fontFamily: fontFamily.regular,
        fontSize: 20,
        textAlign: 'center',
        margin: 8,
        marginBottom: 16,
        textDecorationLine: 'underline'
    },

    cardContent: {
        padding: 8
    },

    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginTop: 4,
        marginLeft: 4,
        backgroundColor: colors.yellowOrange[200],
        borderRadius: 4
    },

    bgYellowOrange: {
        backgroundColor: colors.yellowOrange[100]
    },

    bgYellowWhite: {
        backgroundColor: colors.yellowOrange[10]
    },

    bgLightYellow: {
        backgroundColor: colors.yellowOrange[20]
    },

    bgRose: {
        backgroundColor: colors.rose[200]
    },

    textYellowOrange: {
        color: colors.yellowOrange[100]
    },

    textYellowWhite: {
        color: colors.yellowOrange[10]
    },

    textRose: {
        color: colors.rose[200],
    },

    textGray: {
        color: '#AAA'
    },

    textCenter: {
        textAlign: 'center'
    },

    textSmall: {
        fontSize: 12
    },

    textLarge: {
        fontSize: 24
    },

    textXl: {
        fontSize: 32
    },

    textBold: {
        fontWeight: 'bold'
    },

    btnAlign: {
        padding: 8
    },

    btnPrimary: {
        backgroundColor: colors.rose[200]
    },

    btnSecondary: {
        backgroundColor: colors.yellowOrange[10],
        borderColor: colors.rose[200],
        borderStyle: 'solid',
        borderWidth: 2
    },

    rounded: {
        borderRadius: 10
    },

    fontRegular: {
        fontFamily: fontFamily.regular,
        fontSize: 16
    },

    fontSpecial: {
        fontFamily: fontFamily.special,
        fontSize: 16
    },

    link: {
        textDecorationLine: 'underline',
        color: colors.rose[50]
    },

    m8: {
        margin: 8
    },

    mb8: {
        marginBottom: 8
    },

    mt8: {
        marginTop: 8
    },

    p4: {
        padding: 4
    },

    p8: {
        padding: 8
    },

    p12: {
        padding: 12
    },

    h50: {
        height: 50
    },

    h100: {
        height: 100
    },

    h200: {
        height: 200
    },

    hfull: {
        height: '100%'
    },

    w100: {
        width: 100
    },

    w150: {
        width: 150
    },

    w200: {
        width: 200
    },

    wFull: {
        width: '100%'
    }
});