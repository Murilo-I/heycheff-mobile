import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function FormLogin() {
    const [isActive, setIsActive] = useState(true);

    // Animated values for transitions
    const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity: 1
    const translateXAnim = useRef(new Animated.Value(0)).current; // Initial translateX: 0

    const changeForm = () => {
        setIsActive(!isActive);
        // Animation logic when switching forms
        Animated.timing(translateXAnim, {
            toValue: isActive ? 90 : -90, // Moves switcher left or right
            duration: 300,
            useNativeDriver: true,
        }).start();

        Animated.timing(fadeAnim, {
            toValue: isActive ? 0 : 1, // Fades in or out the form
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.body}>
            {/* Login Form Wrapper */}
            <Animated.View style={[styles.formWrapper, { opacity: fadeAnim }]}>
                <Pressable onPress={changeForm} style={styles.switcher}>
                    <Text style={styles.switcherText}>Sign Up</Text>
                    <View style={styles.underline}></View>
                </Pressable>
                <Animated.View style={styles.form}>
                    <View style={styles.inputBlock}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput style={styles.input} placeholder="Enter username" />
                    </View>
                    <View style={styles.inputBlock}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput style={styles.input} placeholder="Enter password" secureTextEntry />
                    </View>
                    <Pressable style={styles.btnLogin}>
                        <Text style={styles.btnText}>Login</Text>
                    </Pressable>
                </Animated.View>
            </Animated.View>

            {/* Signup Form Wrapper */}
            <Animated.View style={[styles.formWrapper, { opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
                <Pressable onPress={changeForm} style={styles.switcher}>
                    <Text style={styles.switcherText}>Login</Text>
                    <View style={styles.underline}></View>
                </Pressable>
                <Animated.View style={styles.form}>
                    <View style={styles.inputBlock}>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput style={styles.input} placeholder="Enter e-mail" keyboardType="email-address" />
                    </View>
                    <View style={styles.inputBlock}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput style={styles.input} placeholder="Enter username" />
                    </View>
                    <View style={styles.inputBlock}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput style={styles.input} placeholder="Enter password" secureTextEntry />
                    </View>
                    <Pressable style={styles.btnLogin}>
                        <Text style={styles.btnText}>Continue</Text>
                    </Pressable>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    formsSection: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    forms: {
        flexDirection: 'column',
        alignItems: 'center',
        top: 0
    },
    formWrapper: {
        width: '75%',
        alignItems: 'center',
        position: 'absolute',
    },
    switcher: {
        marginVertical: 10,
        textTransform: 'uppercase',
        color: '#999',
    },
    switcherText: {
        fontSize: 16,
        color: '#999',
    },
    underline: {
        height: 2,
        backgroundColor: '#000',
        width: '100%',
        marginTop: 4,
    },
    form: {
        width: '100%',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    inputBlock: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: '#a1b4b4',
    },
    input: {
        width: '100%',
        padding: 10,
        fontSize: 16,
        color: '#3b4465',
        backgroundColor: '#fefeee',
        borderWidth: 1,
        borderColor: '#efeecd',
        borderRadius: 2,
        marginTop: 8,
    },
    btnLogin: {
        backgroundColor: '#F44646',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
    },
});