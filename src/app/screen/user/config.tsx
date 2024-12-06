import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/button";
import { jwtStorage } from "@/storage/jwt";
import { styles } from "@/styles/global";

export default function Config() {
    const { signOut } = useAuth();

    function logout() {
        jwtStorage.removeAll();
        signOut().then(() => router.replace("/"));
    }

    return (
        <View style={[styles.flexColumn, styles.alignStart, styles.wFull]}>
            <Button icon="exit-outline" btnStyle={styles.w100}
                onPress={logout}>
                <Button.Title>Sair</Button.Title>
            </Button>
        </View>
    );
}