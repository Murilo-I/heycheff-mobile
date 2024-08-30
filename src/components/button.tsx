import clsx from "clsx";
import { createContext, useContext } from "react";
import { ActivityIndicator, Text, TextProps, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type Variants = "primary" | "secondary";

type ButtonProps = TouchableOpacityProps & {
    variant?: Variants
    isLoading?: boolean
}

const ThemeContext = createContext<{ variant?: Variants }>({});

function Button({
    variant = "primary",
    children,
    isLoading,
    className,
    ...rest
}: ButtonProps) {
    return (
        <View className={className}>
            <TouchableOpacity
                activeOpacity={.7}
                disabled={isLoading}
                {...rest}
            >
                <View className={clsx(
                    "w-full h-10 flex-row items-center justify-center rounded-xl gap-2 px-2",
                    {
                        "bg-rose-200": variant === "primary",
                        "bg-yellowOrange-10 border border-l-rose-200": variant === "secondary"
                    }
                )}>
                    <ThemeContext.Provider value={{ variant }}>
                        {isLoading ? <ActivityIndicator className="text-yellowOrange-100" /> : children}
                    </ThemeContext.Provider>
                </View>
            </TouchableOpacity>
        </View>
    );
}

function Title({ children, ...rest }: TextProps) {
    const { variant } = useContext(ThemeContext);
    return <Text
        className={clsx(
            "text-base font-regular",
            {
                "text-yellowOrange-10": variant === "primary",
                "text-rose-200": variant === "secondary"
            }
        )}
        {...rest}
    >
        {children}
    </Text>
}

Button.Title = Title;

export { Button };

