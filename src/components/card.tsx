import { useEffect, useState } from "react";
import { Image, Text, TextProps, View, ViewProps } from "react-native";

import { styles } from "@/styles/global";
import { API_URL_MEDIA } from "@/util/endpoints";

function Card({ children }: ViewProps) {
    return (
        <View style={styles.card}>
            {children}
        </View>
    );
}

function Img({ src }: { src: string }) {
    const [imageUrl, setImageUrl] = useState("");
    const [aspectRatio, setAspectRatio] = useState(1);

    useEffect(() => {
        const fetchImageUrl = async () => {
            // const media = await mediaServer.displayMediaSize(src);
            const url = `${API_URL_MEDIA}${src}`;
            Image.getSize(url, (width, height) => {
                const ratio = width > height ? 1.5 : .9;
                setAspectRatio(ratio);
            })
            setImageUrl(url);
        }
        fetchImageUrl();
    }, []);

    return <Image source={{ uri: imageUrl }}
        style={[styles.cardImage, { aspectRatio: aspectRatio }]} />
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

