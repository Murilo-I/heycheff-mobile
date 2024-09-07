import { Image, View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/button";

export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <Image
                style={{ height: 200, width: 200 }}
                source={require('@/assets/logo.png')}
                resizeMode="contain" />
            <Button onPress={() => router.navigate('/screen/feed')}>
                <Button.Title>Explorar</Button.Title>
            </Button>
            <Button onPress={() => router.navigate('/screen/login')}>
                <Button.Title>Login</Button.Title>
            </Button>
        </View>
    );
}