import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

import { Button } from "@/components/button";
import { useImageRecognition } from "@/hooks/useImageRecognition";
import { recipeServer } from "@/server/recipe";
import { tagServer } from "@/server/tag";
import { formsStyles } from "@/styles/forms";
import { styles } from "@/styles/global";
import { loginStyles } from "@/styles/login";

type TagItem = {
    label: string,
    value: string
}

export default function RecipeForm() {
    const { selectedImageUri, isLoading, imgItems, handleThumbnail } = useImageRecognition();

    const [tags, setTags] = useState<TagItem[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [recipeTitle, setRecipeTitle] = useState('');
    const [recipeId, setRecipeId] = useState(0);
    const [isPosting, setIsPosting] = useState(false);

    async function saveRecipe() {
        setIsPosting(true);
        const requestTags = selectedTags.map(selected => {
            const id = tags.find(tag => tag.label === selected)?.value;
            return {
                id: Number.parseInt(id ? id : '0'),
                tag: selected
            }
        });
        const thumb = new Blob([selectedImageUri]);
        const request = { titulo: recipeTitle, tags: requestTags, thumb };
        recipeServer.save(request).then(resp => {
            switch (resp.status) {
                case 200:
                    Alert.alert("Receita cadastrada com sucesso!");
                    setRecipeId(resp.data.seqId);
                    break;

                case 400:
                    Alert.alert("Preencha os campos corretamente!");
                    setIsPosting(false);
                    break;

                default:
                    Alert.alert("Erro ao cadastrar, tente novamente!");
                    console.log(`SaveRecipe Error: status -> ${resp.status} | body: ${resp.data}`);
                    setIsPosting(false);
                    break;
            }
        });
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
                    <View style={[styles.flexInitial, styles.gap8]}>
                        <TextInput style={[styles.wFull, styles.fontRegular, styles.p12, styles.rounded, styles.borded]}
                            placeholder="Título da Receita" value={recipeTitle} onChangeText={setRecipeTitle}
                            editable={recipeId ? false : true} />
                        <MultiSelect
                            style={[formsStyles.dropdown, styles.flex1]}
                            selectedStyle={styles.rounded}
                            selectedTextStyle={[styles.fontRegular, styles.textMedium]}
                            inputSearchStyle={[styles.fontRegular, styles.h40]}
                            labelField="label"
                            valueField="value"
                            placeholder="Selecione uma ou mais categorias"
                            searchPlaceholder="Pesquisar..."
                            disable={recipeId ? true : false}
                            search
                            data={tags}
                            value={selectedTags}
                            onChange={setSelectedTags}
                            renderLeftIcon={() => (
                                <MaterialIcons name="category" size={20} style={styles.mr8} />
                            )}
                        />
                        {!recipeId ?
                            <Button disabled={isPosting} btnStyle={styles.wFull}
                                onPress={saveRecipe}>
                                <Button.Title>Salvar</Button.Title>
                            </Button>
                            :
                            <View></View>
                        }
                    </View>
                </ScrollView>
                {recipeId &&
                    <View style={loginStyles.menu}>
                        <Button btnStyle={loginStyles.menuItem} icon="add-circle-outline"
                            variant="secondary">
                            <Button.Title>Adicionar Step</Button.Title>
                        </Button>
                        <Button btnStyle={loginStyles.menuItem} icon="cloud-upload">
                            <Button.Title>Publicar Receita</Button.Title>
                        </Button>
                    </View>
                }
            </View>
        </View>
    );
}