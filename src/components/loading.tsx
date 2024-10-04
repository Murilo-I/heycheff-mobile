import { ActivityIndicator } from "react-native";

import { colors } from "@/styles/colors";

type LoadingProps = {
    size?: number | "small" | "large" | undefined
}

export function Loading({ size = 'large' }: LoadingProps) {
    return <ActivityIndicator size={size} color={colors.yellowOrange[100]} />
}