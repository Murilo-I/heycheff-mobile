import { useAuth, useUser } from "@clerk/clerk-expo";
import { Href, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { authServer } from "@/server/auth";
import { styles } from "@/styles/global";
import { jwtStorage } from "@/storage/jwt";

export default function User() {
    const { user } = useUser();
    const { sessionId, signOut } = useAuth();
    const [authStatus, setAuthStatus] = useState<number | void>();
    const [isLoading, setIsLoading] = useState(true);

    function logout(redirect: Href<string | object>) {
        jwtStorage.removeAll()
        signOut().then(() => router.replace(redirect));
    }

    async function tokenExpired() {
        return jwtStorage.getExpiration().then(exp => {
            if (exp) {
                const date = Date.parse(exp);
                return Date.now() > date;
            }
            return true;
        });
    }

    useEffect(() => {
        const validate = async () => {
            if (await tokenExpired()) {
                const email = user?.primaryEmailAddress?.emailAddress;
                authServer.authenticateWithClerk(sessionId || '', email || '')
                    .then(status => {
                        setAuthStatus(status);
                        setIsLoading(false);
                    });
            } else {
                setAuthStatus(200);
                setIsLoading(false);
            }
        }
        validate();
    }, []);

    if (isLoading) {
        return <Loading />
    }

    return authStatus === 200 ? (
        <View style={[
            styles.flexRow, styles.justifyBetween,
            styles.mt48, styles.mx8
        ]}>
            <Image source={{ uri: user?.imageUrl }}
                style={[styles.h100, styles.w100, styles.roundedPlus]} />
            <Button icon="exit-outline" btnStyle={styles.w100}
                onPress={() => logout('/')}>
                <Button.Title>Sair</Button.Title>
            </Button>
        </View>
    ) : (
        <View style={[styles.flexCenter, styles.gap16, styles.mt48]}>
            <Text style={styles.fontRegular}>
                Nenhum usuário localizado
            </Text>
            <Button btnStyle={styles.w100} onPress={() => logout('/screen/login')}>
                <Button.Title>Login</Button.Title>
            </Button>
        </View>
    );
}