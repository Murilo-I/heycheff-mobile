import React, { createContext, useContext } from "react";
import { Pressable, PressableProps, Text, TextProps, View } from "react-native";

import { styles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { Loading } from "./loading";

type Variants = "primary" | "secondary" | "tertiary";

type ButtonProps = PressableProps & {
    icon?: keyof typeof Ionicons.glyphMap
    variant?: Variants
    isLoading?: boolean
    children: React.JSX.Element
}

const ThemeContext = createContext<{ variant?: Variants }>({});

function Button({
    variant = "primary",
    icon,
    isLoading,
    children,
    ...rest
}: ButtonProps) {
    return (
        <View>
            <View style={[
                styles.p12, styles.rounded,
                variant === 'primary'
                    ? styles.btnPrimary
                    : styles.btnSecondary
            ]}>
                <Pressable
                    disabled={isLoading}
                    style={[styles.flexRow, styles.justifyCenter, styles.gap8]}
                    {...rest}
                >
                    <ThemeContext.Provider value={{ variant }}>
                        {isLoading ? <Loading size='small' /> : (
                            <>
                                {icon ? <Ionicons name={icon} size={20} color='black' /> : <></>}
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

    var textColor = {}
    if (variant === 'primary')
        textColor = styles.textYellowWhite
    else if (variant === 'secondary')
        textColor = styles.textRose

    return <Text style={[styles.textCenter, styles.fontRegular, textColor]}
        {...rest}>
        {children}
    </Text>
}

Button.Title = Title;

export { Button };

