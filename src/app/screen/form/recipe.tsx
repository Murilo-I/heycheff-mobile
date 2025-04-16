import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

import { Loading } from "@/components/loading";
import { clarifai } from "@/server/clarifai";
import { tagServer } from "@/server/tag";
import { formsStyles } from "@/styles/forms";
import { styles } from "@/styles/global";

type RecognizedItem = {
    name: string,
    percentage: string
}

type ImageConcept = {
    name: string,
    value: number
}

type TagItem = {
    label: string,
    value: string
}

export default function RecipeForm() {
    const [selectedImageUri, setSelectedImageUri] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imgItems, setImgItems] = useState<RecognizedItem[]>([]);

    const [tags, setTags] = useState<TagItem[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [recipeTitle, setRecipeTitle] = useState('');

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

        const concepts = response.data.outputs[0].data.concepts.map((concept: ImageConcept) => {
            return {
                name: concept.name,
                percentage: `${Math.round(concept.value * 100)}%`
            }
        });

        setImgItems(concepts);
        setIsLoading(false);
    }

    useEffect(() => {
        const loadTags = async () => {
            tagServer.findAll().then(tags => tags.map(tag => ({
                "label": tag.tag,
                "value": tag.id.toString()
            })
            )).then(setTags);
        }
        loadTags();
    }, []);

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
                    <View style={styles.flexInitial}>
                        <TextInput style={[styles.wFull, styles.fontRegular, styles.p12, styles.rounded]}
                            placeholder="Título da Receita" value={recipeTitle} onChangeText={setRecipeTitle} />
                        <MultiSelect
                            labelField="label"
                            valueField="value"
                            placeholder="Selecione uma ou mais categorias"
                            searchPlaceholder="Pesquisar..."
                            search
                            data={tags}
                            value={selectedTags}
                            onChange={setSelectedTags}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}