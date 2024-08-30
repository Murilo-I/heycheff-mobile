import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        <View style={styles.body} className="bg-gradient-to-l from-yellowOrange-100 to-rose-50">
            <View style={styles.formsSection}>
                <View style={styles.forms}>
                    {/* Login Form Wrapper */}
                    <Animated.View style={[styles.formWrapper, { opacity: fadeAnim }]}>
                        <TouchableOpacity onPress={changeForm} style={styles.switcher}>
                            <Text style={styles.switcherText}>Login</Text>
                            <View style={styles.underline}></View>
                        </TouchableOpacity>
                        <Animated.View style={styles.form}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Username</Text>
                                <TextInput style={styles.input} placeholder="Enter username" />
                            </View>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput style={styles.input} placeholder="Enter password" secureTextEntry />
                            </View>
                            <TouchableOpacity style={styles.btnLogin}>
                                <Text style={styles.btnText}>Login</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>

                    {/* Signup Form Wrapper */}
                    <Animated.View style={[styles.formWrapper, { opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
                        <TouchableOpacity onPress={changeForm} style={styles.switcher}>
                            <Text style={styles.switcherText}>Sign Up</Text>
                            <View style={styles.underline}></View>
                        </TouchableOpacity>
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
                            <TouchableOpacity style={styles.btnSignup}>
                                <Text style={styles.btnText}>Continue</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                </View>
            </View>
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
    },
    formWrapper: {
        width: '100%',
        alignItems: 'center',
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
        backgroundColor: '#fff',
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
    btnSignup: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#F44646',
        borderWidth: 1,
        marginTop: 20,
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
    },
});