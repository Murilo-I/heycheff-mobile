import { ActivityIndicator } from "react-native";

import { styles } from "@/styles/global";
import { colors } from "@/styles/colors";

export function Loading() {
    return <ActivityIndicator size='large' color={colors.yellowOrange[100]}
        style={styles.flexCenter} />
}