import { useEffect, useState } from "react";
import { Image, Text, TextProps, View, ViewProps } from "react-native";

import { mediaServer } from "@/server/media";

function Card({ children }: ViewProps) {
    return (
        <View >
            {children}
        </View>
    );
}

function Img({ src }: { src: string }) {
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        const fetchImageUrl = async () => {
            const media = await mediaServer.displayMedia(src);
            setImageUrl(media);
        }
        fetchImageUrl();
    }, []);

    return <Image source={{ uri: imageUrl }} style={{height: 300}} />
}

function Title({ children }: TextProps) {
    return <Text>
        {children}
    </Text>
}

function Content({ children }: ViewProps) {
    return (
        <View>
            {children}
        </View>
    );
}

Card.Img = Img;
Card.Title = Title;
Card.Content = Content;

export { Card };
