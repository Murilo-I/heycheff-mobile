import React, { createContext, useContext } from "react";
import { Pressable, PressableProps, StyleProp, Text, TextProps, View, ViewStyle } from "react-native";

import { styles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { Loading } from "./loading";

type Variants = "primary" | "secondary" | "tertiary";

type ButtonProps = PressableProps & {
    icon?: keyof typeof Ionicons.glyphMap
    variant?: Variants
    isLoading?: boolean
    btnStyle?: StyleProp<ViewStyle>
}

const ThemeContext = createContext<{ variant?: Variants }>({});

function Button({
    variant = "primary",
    icon,
    isLoading,
    btnStyle,
    disabled,
    children,
    ...rest
}: ButtonProps) {
    let iconColor;

    switch (variant) {
        case 'primary':
            iconColor = 'white';
            break;

        case 'secondary':
            iconColor = '#F44646';
            break;

        default:
            iconColor = 'black';
            break;
    }

    return (
        <View style={disabled ? { opacity: .8 } : null}>
            <View style={[
                styles.p12, styles.rounded,
                variant === 'primary'
                    ? styles.btnPrimary
                    : styles.btnSecondary
            ]}>
                <Pressable
                    disabled={isLoading || disabled}
                    style={[styles.flexRow, styles.justifyCenter, styles.gap8, btnStyle]}
                    {...rest}
                >
                    <ThemeContext.Provider value={{ variant }}>
                        {isLoading ? <Loading size='small' /> : (
                            <>
                                {icon ?
                                    <Ionicons name={icon} size={20} color={iconColor} />
                                    : null}
                                {children}
                            </>
                        )}
                    </ThemeContext.Provider>
                </Pressable>
            </View>
        </View>
    );
}

function Title({ children, ...rest }: TextProps) {
    const { variant } = useContext(ThemeContext);
    let textColor;

    switch (variant) {
        case 'primary':
            textColor = styles.textYellowWhite;
            break;

        case 'secondary':
            textColor = styles.textRose;
            break

        default:
            textColor = {}
            break;
    }

    return <Text style={[styles.textCenter, styles.fontRegular, textColor]}
        {...rest}>
        {children}
    </Text>
}

Button.Title = Title;

export { Button };

