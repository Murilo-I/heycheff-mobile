import { StyleSheet } from "react-native"

import { colors } from "./colors";
import { fontFamily } from "./fontFamily";

export const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        gap: 16
    },

    flexInitial: {
        flex: 1,
        justifyContent: 'flex-start'
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

    contentBetween: {
        alignContent: 'space-between'
    },

    card: {
        flex: 1,
    },

    cardImage: {
        height: 300
    },

    cardTitle: {
    },

    cardContent: {
    },

    bgYellowOrange: {
        backgroundColor: colors.yellowOrange[100]
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

    m8: {
        margin: 8
    },

    mb8: {
        marginBottom: 8
    },

    mt8: {
        marginTop: 8
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