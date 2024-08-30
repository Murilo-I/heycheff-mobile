import { Image, View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/button";

export default function Index() {
    return (
        <View className="flex-1 items-center justify-center px-5 bg-yellowOrange-100">
            <Image
                source={require('@/assets/logo.png')}
                resizeMode="contain" />
            <Button className="w-1/2" onPress={() => router.navigate('/feed/feed')}>
                <Button.Title>Explorar</Button.Title>
            </Button>
            <Button className="w-1/2" onPress={() => router.navigate('/login/login')}>
                <Button.Title>Login</Button.Title>
            </Button>
        </View>
    );
}