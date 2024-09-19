import { ActivityIndicator } from "react-native";

import { styles } from "@/styles/global";

export function Loading() {
    return <ActivityIndicator style={[styles.flexCenter, styles.bgYellowOrange]} />
}