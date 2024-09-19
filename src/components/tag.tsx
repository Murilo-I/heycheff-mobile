import { Text, View } from "react-native";

export default function Tag({ text }: { text: string }) {
    return (
        <View>
            <Text>
                {text}
            </Text>
        </View>
    );
}