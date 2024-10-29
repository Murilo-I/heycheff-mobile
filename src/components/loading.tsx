import { ActivityIndicator } from "react-native";

import { colors } from "@/styles/colors";
import { styles } from "@/styles/global";

type LoadingProps = {
    size?: number | "small" | "large" | undefined
}

export function Loading({ size = 'large' }: LoadingProps) {
    return <ActivityIndicator style={styles.flexCenter} size={size} color={colors.yellowOrange[100]} />
}