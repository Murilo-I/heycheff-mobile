import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

import { Button } from "@/components/button";
import { StepCadModal } from "@/components/steps/cadModal";
import { useImageRecognition } from "@/hooks/useImageRecognition";
import { recipeServer } from "@/server/recipe";
import { tagServer } from "@/server/tag";
import { formsStyles } from "@/styles/forms";
import { styles } from "@/styles/global";
import { loginStyles } from "@/styles/login";
import { DataTable } from "react-native-paper";

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
    const [openStepModal, setOpenModal] = useState(false);

    async function saveRecipe() {
        // setIsPosting(true);
        const requestTags = selectedTags.map(selected => {
            const tag = tags.find(tag => tag.value === selected)?.label;
            return {
                id: Number.parseInt(selected),
                tag: tag ? tag : ''
            }
        });
        const thumb = await fetch(selectedImageUri).then(r => r.blob());
        const file = {
            uri: selectedImageUri,
            name: 'thumb.jpg',
            type: thumb.type,
        };
        console.log('recipe tags: ', requestTags);
        const request = { titulo: recipeTitle, tags: requestTags, file };
        recipeServer.save(request).then(resp => {
            switch (resp.status) {
                case 201:
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
        })
            .catch(error => {
                if (error.response) {
                    console.log('Backend error response:', error.response.data);
                } else if (error.request) {
                    console.log('No response received:', error.request);
                } else {
                    console.log('Error setting up request:', error.message);
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
                            style={
                                recipeId ? { display: 'none' } : [formsStyles.dropdown, styles.flex1]
                            }
                            selectedStyle={styles.rounded}
                            selectedTextStyle={[styles.fontRegular, styles.textMedium]}
                            inputSearchStyle={[styles.fontRegular, styles.h40]}
                            placeholderStyle={styles.fontRegular}
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
                            <View style={styles.my16}>
                                <Text style={[styles.fontRegular, styles.textSmall]}>
                                    Nenhum Step Adicionado
                                </Text>
                            </View>
                        }
                    </View>
                    {recipeId &&
                        <View style={[loginStyles.menu, styles.my16, styles.h50]}>
                            <Button icon="add-circle-outline"
                                onPress={() => setOpenModal(true)} variant="secondary">
                                <Button.Title>Add Step</Button.Title>
                            </Button>
                            <Button btnStyle={styles.p2} icon="cloud-upload">
                                <Button.Title>Publicar Receita</Button.Title>
                            </Button>
                        </View>
                    }
                </ScrollView>
            </View>
            <StepCadModal openModal={openStepModal} setOpenModal={setOpenModal} />
        </View>
    );
}