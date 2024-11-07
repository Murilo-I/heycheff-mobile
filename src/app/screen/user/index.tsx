import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addContent, increasePage, setInfo } from "@/redux/user/profileSlice";
import { authServer } from "@/server/auth";
import { receiptServer } from "@/server/receipt";
import { userServer } from "@/server/user";
import { jwtStorage } from "@/storage/jwt";
import { userId } from "@/storage/userId";
import { styles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import Config, { logout } from "./config";
import Posts from "./posts";

export default function User(id?: string) {
    const { user } = useUser();
    const { sessionId } = useAuth();

    const [authStatus, setAuthStatus] = useState<number | void>();
    const [isLoading, setIsLoading] = useState(true);
    const [option, setOption] = useState<"posts" | "config">("posts");

    const userProfile = useAppSelector(state => state.profile);
    const dispatch = useAppDispatch();

    const isPosts = option === "posts";
    const pageSize = 12;

    const tokenExpired = async () => {
        return jwtStorage.getExpiration().then(exp => {
            if (exp) {
                try {
                    return Date.now() > Number.parseInt(exp);
                } catch (error) {
                    console.log(error);
                    return true;
                }
            }
            return true;
        });
    }

    const fetchUserProfile = async () => {
        const uid = id ? id : await userId.get();
        if (uid) {
            const userInfo = await userServer.findById(uid);
            dispatch(setInfo(userInfo));
        }
    }

    const fetchUserContent = async () => {
        const uid = userId.get().then(id => {
            if (id) {
                return id;
            } else {
                return undefined;
            }
        });

        receiptServer.loadFeed(userProfile.contentPage, pageSize, await uid)
            .then(feedResponse => {
                dispatch(addContent(feedResponse.data.items));
                dispatch(increasePage());
                dispatch(increasePage());
            }).catch(error => console.log(error));
    }

    useEffect(() => {
        const validateToken = async () => {
            if (await tokenExpired()) {
                const email = user?.primaryEmailAddress?.emailAddress;
                authServer.authenticateWithClerk(sessionId || '', email || '')
                    .then(setAuthStatus);
            } else {
                setAuthStatus(200);
            }
        }

        validateToken().then(() => {
            if (!userProfile.info) {
                fetchUserProfile();
            }
            if (userProfile.content.length === 0) {
                fetchUserContent();
            }
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return <Loading />
    }

    return authStatus === 200 ? (
        <View style={[
            styles.flexColumn, styles.alignCenter,
            styles.mt48, styles.mx8, styles.gap16
        ]}>
            <Image source={{ uri: user?.imageUrl }}
                style={[styles.h100, styles.w100, styles.roundedPlus]} />
            {userProfile.info ? (
                <>
                    <Text style={styles.fontRegular}>{userProfile.info.username}</Text>
                    <View style={[
                        styles.flexRow, styles.justifyEvenly, styles.mt8,
                        styles.flexContent, styles.wFull
                    ]}>
                        <Text style={styles.fontRegular}>
                            {'Seguidores: ' + userProfile.info.followers}
                        </Text>
                        <Text style={styles.borderLeft} />
                        <Text style={styles.fontRegular}>
                            {'Seguindo: ' + userProfile.info.following}
                        </Text>
                        <Text style={styles.borderLeft} />
                        <Text style={styles.fontRegular}>
                            {'Posts: ' + userProfile.info.receiptsCount}
                        </Text>
                    </View>
                    <View style={[
                        styles.flexRow, styles.flexContent, styles.wFull
                    ]}>
                        <TouchableOpacity style={[
                            styles.flexHalf, styles.p8, styles.alignCenter,
                            isPosts ? styles.bgLightYellow : null
                        ]}
                            onPress={() => setOption("posts")}>
                            <Ionicons name={isPosts ? 'apps' : 'apps-outline'} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[
                            styles.flexHalf, styles.p8, styles.alignCenter,
                            isPosts ? null : styles.bgLightYellow
                        ]}
                            onPress={() => setOption("config")}>
                            <Ionicons name={isPosts ? 'settings-outline' : 'settings'} size={20} />
                        </TouchableOpacity>
                    </View>
                    {isPosts ? <Posts /> : <Config />}
                </>
            ) : <Loading />}
        </View>
    ) : (
        <View style={[styles.flexCenter, styles.gap16, styles.mt48]}>
            <Text style={styles.fontRegular}>
                Nenhum usuário localizado
            </Text>
            <Button btnStyle={styles.w100} onPress={() => logout('/start/login')}>
                <Button.Title>Login</Button.Title>
            </Button>
        </View>
    );
}