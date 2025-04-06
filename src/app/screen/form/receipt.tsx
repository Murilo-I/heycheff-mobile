import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Loading } from "@/components/loading";
import { clarifai } from "@/server/clarifai";
import { formsStyles } from "@/styles/forms";
import { styles } from "@/styles/global";

type Items = {
    name: string,
    percentage: string
}

type Concept = {
    name: string,
    value: number
}

export default function ReceiptForm() {
    const [selectedImageUri, setSelectedImageUri] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState<Items[]>([]);

    async function handleThumbnail() {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== ImagePicker.PermissionStatus.GRANTED) {
                return Alert.alert("É necessário conceder permissão a sua galeria.");
            }

            setIsLoading(true);
            const response = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1
            });

            if (response.canceled) {
                return setIsLoading(false);
            } else {
                const imgContext = ImageManipulator.manipulate(response.assets[0].uri);
                imgContext.resize({ width: 900 });
                const imgRender = await imgContext.renderAsync();
                const imgResult = await imgRender.saveAsync({
                    compress: 1,
                    format: SaveFormat.JPEG,
                    base64: true
                });
                setSelectedImageUri(imgResult.uri);
                analyseThumbnail(imgResult.base64);
            }

        } catch (error) {
            console.log(error);
        }
    }

    async function analyseThumbnail(imgBase64: string | undefined) {
        const modelId = process.env.EXPO_PUBLIC_MODEL_ID;
        const versionId = process.env.EXPO_PUBLIC_MODEL_VERSION_ID;

        const response = await clarifai.post(
            `/v2/models/${modelId}/versions/${versionId}/outputs`, {
            "user_app_id": {
                "user_id": process.env.EXPO_PUBLIC_USER_ID,
                "app_id": process.env.EXPO_PUBLIC_APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "base64": imgBase64
                        }
                    }
                }
            ]
        });

        const concepts = response.data.outputs[0].data.concepts.map((concept: Concept) => {
            return {
                name: concept.name,
                percentage: `${Math.round(concept.value * 100)}%`
            }
        });

        setItems(concepts);
        setIsLoading(false);
    }

    return (
        <View style={styles.flex1}>
            {
                selectedImageUri ?
                    <TouchableOpacity style={styles.flex1}
                        onPress={handleThumbnail} disabled={isLoading}>
                        <Image source={{ uri: selectedImageUri }}
                            resizeMode="cover" style={styles.flex1} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.flexCenter]}
                        onPress={handleThumbnail}>
                        <Text style={styles.fontRegular}>
                            Toque para adicionar uma thumb a receita.
                        </Text>
                    </TouchableOpacity>
            }
            <View style={[formsStyles.bottomContainer, styles.bgYellowWhite]}>
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 12, marginVertical: 6 }}>
                    {
                        isLoading ?
                            <Loading />
                            :
                            items.map(item => (
                                <Text key={item.name} style={[
                                    styles.fontRegular, styles.p12, styles.rounded,
                                    styles.bgLightYellow, formsStyles.itemBox
                                ]}>
                                    {item.percentage} - {item.name}
                                </Text>
                            ))
                    }
                </ScrollView>
            </View>
        </View>
    );
}