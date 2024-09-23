import { useEffect, useState } from "react";
import { Image, Text, TextProps, View, ViewProps } from "react-native";

import { mediaServer } from "@/server/media";
import { styles } from "@/styles/global";

function Card({ children }: ViewProps) {
    return (
        <View style={styles.card}>
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

    return <Image source={{ uri: imageUrl }} style={styles.cardImage} />
}

function Title({ children }: TextProps) {
    return <Text style={styles.cardTitle}>
        {children}
    </Text>
}

function Content({ children }: ViewProps) {
    return (
        <View style={styles.cardContent}>
            {children}
        </View>
    );
}

Card.Img = Img;
Card.Title = Title;
Card.Content = Content;

export { Card };
