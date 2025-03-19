import { useAuth } from "@clerk/clerk-expo";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";

import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { useAppDispatch } from "@/redux/hooks";
import { setNavIndex, tabs } from "@/redux/nav/navigationSlice";
import { styles } from "@/styles/global";

export default function Index() {
    const { isSignedIn, isLoaded } = useAuth();
    const nav = useNavigation();
    const dispatch = useAppDispatch();

    function navigateToFeed() {
        dispatch(setNavIndex(tabs.FEED));
        router.navigate('/screen/feed');
    }

    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn) {
            let routes = nav.getState().routes;
            dispatch(setNavIndex(tabs.PERFIL));
            router.replace('/screen/user');
        }
    }, [isSignedIn]);

    return isLoaded ? (
        <View style={[styles.flexCenter, styles.p12, styles.gap16, styles.bgYellowOrange]}>
            <Image
                style={[styles.h200, styles.w200, styles.mb8]}
                source={require('@/assets/logo.png')}
                resizeMode="contain" />
            <Button btnStyle={styles.w150} onPress={navigateToFeed}>
                <Button.Title>Explorar</Button.Title>
            </Button>
            <Button btnStyle={styles.w150} onPress={() => router.navigate('/start/login')}>
                <Button.Title>Login</Button.Title>
            </Button>
        </View>
    ) : <Loading />
}