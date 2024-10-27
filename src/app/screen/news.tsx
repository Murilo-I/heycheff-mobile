import { styles } from "@/styles/global";
import { Text, View } from "react-native";

export default function News() {
    return (
        <View style={styles.flexCenter}>
            <Text style={styles.fontRegular}>Novidades</Text>
        </View>
    );
}