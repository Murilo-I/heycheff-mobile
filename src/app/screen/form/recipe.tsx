import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

import { Button } from "@/components/button";
import { useImageRecognition } from "@/hooks/useImageRecognition";
import { tagServer } from "@/server/tag";
import { formsStyles } from "@/styles/forms";
import { styles } from "@/styles/global";

type TagItem = {
    label: string,
    value: string
}

export default function RecipeForm() {
    const { selectedImageUri, isLoading, imgItems, handleThumbnail } = useImageRecognition();

    const [tags, setTags] = useState<TagItem[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [recipeTitle, setRecipeTitle] = useState('');

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
                    <View style={[styles.flexInitial, styles.gap8]}>
                        <TextInput style={[styles.wFull, styles.fontRegular, styles.p12, styles.rounded, styles.borded]}
                            placeholder="Título da Receita" value={recipeTitle} onChangeText={setRecipeTitle} />
                        <MultiSelect
                            style={[formsStyles.dropdown, styles.flex1]}
                            selectedStyle={styles.rounded}
                            selectedTextStyle={[styles.fontRegular, styles.textMedium]}
                            inputSearchStyle={[styles.fontRegular, styles.h40]}
                            labelField="label"
                            valueField="value"
                            placeholder="Selecione uma ou mais categorias"
                            searchPlaceholder="Pesquisar..."
                            search
                            data={tags}
                            value={selectedTags}
                            onChange={setSelectedTags}
                            renderLeftIcon={() => (
                                <MaterialIcons name="category" size={20} style={styles.mr8} />
                            )}
                        />
                        <Button btnStyle={styles.wFull}>
                            <Button.Title>Salvar</Button.Title>
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}