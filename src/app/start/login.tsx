import { useAuth, useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';

import { BackgroundImage } from '@/components/backgroundImage';
import { Button } from '@/components/button';
import { styles } from '@/styles/global';
import { loginStyles } from '@/styles/login';

WebBrowser.maybeCompleteAuthSession()

export default function FormLogin() {
    const fadeInDown = (delay: number) => FadeInDown.delay(delay).duration(800).springify();
    const [isLoading, setIsLoading] = useState(false);
    const googleOAuth = useOAuth({ strategy: 'oauth_google' });
    const { isSignedIn } = useAuth();

    async function onGoogleSignIn() {
        try {
            if (isSignedIn) router.replace('/screen/user');

            setIsLoading(true);
            const redirectUrl = Linking.createURL('/');
            const oAuth = await googleOAuth.startOAuthFlow({ redirectUrl });

            if (oAuth.authSessionResult?.type === 'success') {
                if (oAuth.setActive) {
                    const session = oAuth.createdSessionId
                    await oAuth.setActive({ session });
                }
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        WebBrowser.warmUpAsync();
        return () => { WebBrowser.coolDownAsync() }
    }, []);

    return (
        <View style={[styles.wFull, styles.hfull, styles.bgYellowWhite]}>
            <BackgroundImage />
            <View style={loginStyles.formSection}>
                <View style={loginStyles.fieldContainer}>
                    <Animated.Text entering={FadeInUp.duration(800).springify()}
                        style={[styles.textYellowWhite, styles.fontRegular, styles.textXl, styles.textBold]}>
                        Login
                    </Animated.Text>
                </View>
                <View style={loginStyles.fieldContainer}>
                    <Animated.View style={styles.wFull} entering={fadeInDown(0)}>
                        <TextInput style={[styles.fontRegular, styles.p12, styles.rounded, styles.bgLightYellow]}
                            placeholder='Username' placeholderTextColor={'#AAA'} />
                    </Animated.View>
                    <Animated.View style={styles.wFull} entering={fadeInDown(200)}>
                        <TextInput style={[styles.fontRegular, styles.p12, styles.rounded, styles.bgLightYellow]}
                            placeholder='Senha' placeholderTextColor={'#AAA'} secureTextEntry />
                    </Animated.View>
                    <Animated.View style={[styles.wFull, styles.mt8]} entering={fadeInDown(400)}>
                        <Button>
                            <Button.Title>Login</Button.Title>
                        </Button>
                    </Animated.View>
                    <View style={loginStyles.menu}>
                        <Animated.View style={loginStyles.menuItem}
                            entering={FadeInLeft.delay(500).duration(800).springify()}>
                            <Text style={[styles.fontRegular, styles.textCenter, styles.mb8]}>
                                Entre com Google
                            </Text>
                            <Button variant='tertiary' onPress={onGoogleSignIn}
                                icon='logo-google' isLoading={isLoading}>
                                <Button.Title>Login</Button.Title>
                            </Button>
                        </Animated.View>
                        <Animated.View style={loginStyles.menuItem}
                            entering={FadeInRight.delay(500).duration(800).springify()}>
                            <Text style={[styles.fontRegular, styles.textCenter, styles.mb8]}>
                                Não tem conta?
                            </Text>
                            <Button variant='secondary'
                                onPress={() => router.navigate('/start/signup')}>
                                <Button.Title>Sign Up</Button.Title>
                            </Button>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    );
}