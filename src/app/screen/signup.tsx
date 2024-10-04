import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { BackgroundImage } from '@/components/backgroundImage';
import { Button } from '@/components/button';
import { styles } from '@/styles/global';
import { loginStyles } from '@/styles/login';
import { router } from 'expo-router';

export default function FormSignup() {
    const fadeInDown = (delay: number) => FadeInDown.delay(delay).duration(800).springify();

    return (
        <View style={[styles.wFull, styles.hfull, styles.bgYellowWhite]}>
            <BackgroundImage />
            <View style={loginStyles.formSection}>
                <View style={loginStyles.fieldContainer}>
                    <Animated.Text entering={FadeInUp.duration(800).springify()}
                        style={[styles.textYellowWhite, styles.fontRegular, styles.textXl, styles.textBold]}>
                        Sign Up
                    </Animated.Text>
                </View>
                <View style={loginStyles.fieldContainer}>
                    <Animated.View style={styles.wFull} entering={fadeInDown(0)}>
                        <TextInput style={[styles.fontRegular, styles.p12, styles.rounded, styles.bgLightYellow]}
                            placeholder='Username' placeholderTextColor={'#AAA'} />
                    </Animated.View>
                    <Animated.View style={styles.wFull} entering={fadeInDown(150)}>
                        <TextInput style={[styles.fontRegular, styles.p12, styles.rounded, styles.bgLightYellow]}
                            placeholder='Email' placeholderTextColor={'#AAA'} />
                    </Animated.View>
                    <Animated.View style={styles.wFull} entering={fadeInDown(300)}>
                        <TextInput style={[styles.fontRegular, styles.p12, styles.rounded, styles.bgLightYellow]}
                            placeholder='Senha' placeholderTextColor={'#AAA'} secureTextEntry />
                    </Animated.View>
                    <Animated.View style={[styles.wFull, styles.mt8]} entering={fadeInDown(450)}>
                        <Button>
                            <Button.Title>Login</Button.Title>
                        </Button>
                    </Animated.View>
                    <Animated.View entering={fadeInDown(550)}
                        style={[loginStyles.menu, styles.justifyCenter]}>
                        <Text style={[styles.fontRegular]}>
                            Já possui uma conta?
                            {" "}
                            <Pressable onPress={() => router.navigate('/screen/login')}>
                                <Text style={[styles.fontRegular, styles.link]}>
                                    Login
                                </Text>
                            </Pressable>
                        </Text>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}