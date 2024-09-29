import { Image, View } from "react-native";
import Animated, { FadeInUp } from 'react-native-reanimated';

import { styles } from "@/styles/global";

export function BackgroundImage() {
    return (
        <>
            <Image source={require('@/assets/bg-login.png')}
                style={[styles.absolute, styles.wFull, styles.hfull]} />
            <View style={[styles.flexRow, styles.justifyAround, styles.wFull, styles.absolute]}>
                <Animated.Image
                    entering={FadeInUp.delay(200).duration(1000).springify()}
                    source={require("@/assets/mustache-pendle.png")}
                    style={{ height: 210, width: 120 }}
                />
                <Animated.Image
                    entering={FadeInUp.delay(400).duration(1000).springify()}
                    source={require("@/assets/blanche-pendle.png")}
                    style={{ height: 145, width: 170 }}
                />
            </View>
        </>
    );
}