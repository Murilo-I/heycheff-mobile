import { Image, View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/button";
import { styles } from "@/styles/global";

export default function Index() {
    return (
        <View style={[styles.flexCenter, styles.bgYellowOrange]}>
            <Image
                style={[styles.h200, styles.w200, styles.mb8]}
                source={require('@/assets/logo.png')}
                resizeMode="contain" />
            <Button style={styles.w150} onPress={() => router.navigate('/screen/feed')}>
                <Button.Title>Explorar</Button.Title>
            </Button>
            <Button style={styles.w150} onPress={() => router.navigate('/screen/login')}>
                <Button.Title>Login</Button.Title>
            </Button>
        </View>
    );
}