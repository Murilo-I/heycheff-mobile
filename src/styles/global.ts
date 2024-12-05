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

    flex1: {
        flex: 1,
        width: '100%'
    },

    flexContent: {
        flex: -1
    },

    flexHalf: {
        flex: .5
    },

    flexRow: {
        flexDirection: 'row'
    },

    flexColumn: {
        flex: 1,
        flexDirection: 'column'
    },

    flexWrap: {
        flexWrap: 'wrap'
    },

    gap8: {
        gap: 8
    },

    gap16: {
        gap: 16
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

    justifyBetween: {
        justifyContent: 'space-between'
    },

    justifyEvenly: {
        justifyContent: 'space-evenly'
    },

    contentBetween: {
        alignContent: 'space-between'
    },

    alignCenter: {
        alignItems: 'center'
    },

    alignStart: {
        alignItems: 'flex-start'
    },

    absolute: {
        position: 'absolute'
    },

    transparent: {
        opacity: .7
    },

    z1: {
        zIndex: 1
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

    postGrid: {
        gap: 2,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    postImage: {
        height: 124,
        width: '33%',
        maxWidth: 124,
        marginHorizontal: 1
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

    textJustify: {
        textAlign: 'justify'
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

    roundedPlus: {
        borderRadius: 20
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

    borderLeft: {
        borderLeftWidth: 2
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

    mt16: {
        marginTop: 16
    },

    mt48: {
        marginTop: 48
    },

    mx8: {
        marginHorizontal: 8
    },

    my16: {
        marginVertical: 16
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