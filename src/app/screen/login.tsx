import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';

import { BackgroundImage } from '@/components/backgroundImage';
import { styles } from '@/styles/global';
import { loginStyles } from '@/styles/login';
import { router } from 'expo-router';

export default function FormLogin() {
    const fadeInDown = (delay: number) => FadeInDown.delay(delay).duration(800).springify();

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
                        <Pressable style={[styles.wFull, styles.rounded, styles.p12, styles.bgRose]}>
                            <Text style={[styles.fontRegular, styles.textCenter, styles.textYellowWhite]}>
                                Login
                            </Text>
                        </Pressable>
                    </Animated.View>
                    <View style={loginStyles.menu}>
                        <Animated.View style={loginStyles.menuItem}
                            entering={FadeInLeft.delay(500).duration(800).springify()}>
                            <Text style={[styles.fontRegular, styles.textCenter, styles.mb8]}>
                                Entre com Google
                            </Text>
                            <Pressable style={[
                                styles.btnSecondary, styles.rounded, styles.p12, styles.flexRow,
                                styles.justifyCenter, styles.gap8
                            ]}>
                                <Icon size={20} source={require('@/assets/google.svg')} />
                                <Text style={[styles.fontRegular, styles.textCenter]}>Login</Text>
                            </Pressable>
                        </Animated.View>
                        <Animated.View style={loginStyles.menuItem}
                            entering={FadeInRight.delay(500).duration(800).springify()}>
                            <Text style={[styles.fontRegular, styles.textCenter, styles.mb8]}>
                                Não possui conta?
                            </Text>
                            <Pressable style={[styles.btnSecondary, styles.rounded, styles.p12]}
                                onPress={() => router.navigate('/screen/signup')}>
                                <Text style={[styles.fontRegular, styles.textCenter]}>Sign Up</Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    );
}