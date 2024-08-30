import { useEffect, useState } from "react";
import { Image, Text, TextProps, View, ViewProps } from "react-native";

import { mediaServer } from "@/server/media";

function Card({ children }: ViewProps) {
    return (
        <View className="w-full flex-1 justify-center bg-transparent border-solid rounded-xl">
            {children}
        </View>
    );
}

function Img({ src }: { src: string }) {
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        const fetchImageUrl = async () => {
            setImageUrl(await mediaServer.displayMedia(src));
        }
        fetchImageUrl();
    }, []);

    return <Image source={{ uri: imageUrl }}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        className="w-full rounded-t-xl border-b border-yellowOrange-100" />
}

function Title({ children }: TextProps) {
    return <Text className="font-regular font-bold text-xl text-center my-3">
        {children}
    </Text>
}

function Content({ children }: ViewProps) {
    return (
        <View className="flex-row items-center justify-center p-4">
            {children}
        </View>
    );
}

Card.Img = Img;
Card.Title = Title;
Card.Content = Content;

export { Card };
