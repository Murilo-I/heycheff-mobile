import React, { createContext, useContext } from "react";
import { Pressable, PressableProps, Text, TextProps, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

import { styles } from "@/styles/global";
import { Loading } from "./loading";

type Variants = "primary" | "secondary";

type ButtonProps = PressableProps & {
    variant?: Variants
    isLoading?: boolean
    children: React.JSX.Element
}

const ThemeContext = createContext<{ variant?: Variants }>({});

function Button({
    variant = "primary",
    isLoading,
    children,
    ...rest
}: ButtonProps) {
    return (
        <View>
            <Pressable
                disabled={isLoading}
                {...rest}
            >
                <View style={[
                    styles.flexCenter, styles.rounded,
                    variant === 'primary'
                        ? styles.btnPrimary
                        : styles.btnSecondary
                ]}>
                    <ThemeContext.Provider value={{ variant }}>
                        {isLoading ? <Loading /> : children}
                    </ThemeContext.Provider>
                </View>
            </Pressable>
        </View>
    );
}

function Title({ children, ...rest }: TextProps) {
    const { variant } = useContext(ThemeContext);
    return <Text style={[
        styles.fontRegular, variant === 'primary'
            ? styles.textYellowWhite
            : styles.textRose
    ]} {...rest}>
        {children}
    </Text>
}

Button.Title = Title;

export { Button };