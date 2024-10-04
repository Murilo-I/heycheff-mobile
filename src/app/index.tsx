import { useAuth } from "@clerk/clerk-expo";
import { router, useNavigation } from "expo-router";
import { Image, View } from "react-native";

import { Button } from "@/components/button";
import { styles } from "@/styles/global";
import { useEffect } from "react";

export default function Index() {
    const { isSignedIn, isLoaded } = useAuth();
    const nav = useNavigation();

    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn) {
            let routes = nav.getState().routes;
            console.log(routes);
            router.replace('/screen/feed');
        }
    }, [isSignedIn]);

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