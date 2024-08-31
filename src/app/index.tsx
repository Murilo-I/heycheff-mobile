import { Image, View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/button";

export default function Index() {
    return (
        <View className="flex-1 items-center justify-center gap-5 px-5 bg-yellowOrange-100">
            <Image
                source={require('@/assets/logo.png')}
                className="h-60 m-5"
                resizeMode="contain" />
            <Button className="w-1/2" onPress={() => router.navigate('/screen/feed')}>
                <Button.Title>Explorar</Button.Title>
            </Button>
            <Button className="w-1/2" onPress={() => router.navigate('/screen/login')}>
                <Button.Title>Login</Button.Title>
            </Button>
        </View>
    );
}