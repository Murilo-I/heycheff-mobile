import { styles } from "@/styles/global";
import { Text, View } from "react-native";

export default function Tag({ text }: { text: string }) {
    return (
        <View style={styles.tag}>
            <Text style={styles.fontRegular}>
                {text}
            </Text>
        </View>
    );
}