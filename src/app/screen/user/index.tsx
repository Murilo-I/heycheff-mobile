import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { FollowButton } from "@/components/user/followButton";
import { UserMenu } from "@/components/user/menu";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ProfileContext } from "@/redux/user/profileContext";
import { addContent, resetContent, setInfo } from "@/redux/user/profileSlice";
import { reset3PartyProfile, set3PartyProfileId } from "@/redux/user/thirdPartySlice";
import { authServer } from "@/server/auth";
import { receiptServer } from "@/server/receipt";
import { FollowResponse, userServer } from "@/server/user";
import { jwtStorage } from "@/storage/jwt";
import { userId } from "@/storage/userId";
import { styles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Config from "./config";
import Posts from "./posts";

export default function User(thirdPartyId?: string) {
    const { user } = useUser();
    const { sessionId } = useAuth();

    const [authStatus, setAuthStatus] = useState<number | void>();
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [option, setOption] = useState<"posts" | "config">("posts");
    const [followingIds, setFollowingIds] = useState<FollowResponse>({ following: [] });
    const [isFollowing, setIsFollowing] = useState(false);
    const [isDisabledFollowButton, setIsDisabledFollowButton] = useState(true);

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
        const uid = thirdPartyId ? thirdPartyId : await userId.get();
        if (uid) {
            const userInfo = await userServer.findById(uid);
            dispatch(setInfo(userInfo));
        }
    }

    const fetchUserContent = async () => {
        const uid = thirdPartyId ? thirdPartyId : await userId.get();
        receiptServer.loadFeed(userProfile.contentPage, pageSize, uid)
            .then(feedResponse => {
                dispatch(addContent(feedResponse.data.items));
            }).catch(error => console.log(error));
    }

    async function goBack() {
        dispatch(set3PartyProfileId(await userId.get()));
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
            setIsFirstLoad(false);
        });
    }, []);

    useEffect(() => {
        setIsFirstLoad(true);
        const hasFollowed = followingIds.following.length;
        const checkIfFollowing = async () => {
            if (hasFollowed) return followingIds.following
                .some(fid => fid === thirdPartyId);
            if (userProfile.info) {
                const inf = thirdPartyId ? await userServer.findById(thirdPartyId) : userProfile.info;
                const uid = await userId.get();
                return inf.followersIds.some(fid => fid === uid);
            }
            return isFollowing;
        }
        const setUserProfile = async () => {
            if (!thirdPartyId) return;
            const isOwnProfile = thirdPartyId === await userId.get();
            if (!hasFollowed || isOwnProfile) {
                dispatch(resetContent());
                fetchUserContent();
            }
            fetchUserProfile().then(() => checkIfFollowing().then(res => {
                setIsFollowing(res);
                setIsDisabledFollowButton(false);
            }));
            if (isOwnProfile) {
                dispatch(reset3PartyProfile());
            }
        }
        setUserProfile().then(() => setIsFirstLoad(false));
    }, [thirdPartyId, followingIds]);

    if (isFirstLoad) return <Loading />

    return authStatus === 200 ? (
        <View style={[
            styles.flexColumn, styles.alignCenter,
            styles.mt48, styles.mx8, styles.gap16
        ]}>
            {(userProfile.info && !isFirstLoad) ? (
                <>
                    {
                        thirdPartyId ? (
                            <>
                                <Pressable onPress={goBack}
                                    style={[styles.absolute, { left: 0 }]}>
                                    <Ionicons name="arrow-back-circle-outline" size={30} />
                                </Pressable>
                                <Ionicons name="person-circle-sharp" size={100} />
                            </>
                        ) : <Image source={{ uri: user?.imageUrl }}
                            style={[styles.h100, styles.w100, styles.roundedPlus]} />
                    }
                    <Text style={styles.fontRegular}>
                        {userProfile.info.username}
                    </Text>
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
                    <View style={[styles.flexRow, styles.flexContent, styles.wFull]}>
                        <ProfileContext.Provider value={{
                            thirdPartyId, option, setOption,
                            followingIds, setFollowingIds,
                            isFollowing, isPosts
                        }}>
                            {thirdPartyId ? <FollowButton disabled={isDisabledFollowButton} /> : <UserMenu />}
                        </ProfileContext.Provider>
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
            <Button btnStyle={styles.w100} onPress={() => router.replace('/start/login')}>
                <Button.Title>Login</Button.Title>
            </Button>
        </View>
    );
}