import { Text, View } from "react-native";

export default function Tag({ text }: { text: string }) {
    return (
        <View className="inline-block bg-yellowOrange-200 p-3 rounded-sm">
            <Text className="font-regular font-bold text-sm">
                {text}
            </Text>
        </View>
    );
}