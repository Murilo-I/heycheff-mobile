import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Button } from "@/components/button";
import { StepCadModal } from "@/components/steps/cadModal";
import { DataTable, RowItem } from "@/components/steps/dataTable";
import { useImageRecognition } from "@/hooks/useImageRecognition";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setStepNumber } from "@/redux/step/stepSlice";
import { recipeServer } from "@/server/recipe";
import { StepRequest } from "@/server/step";
import { tagServer } from "@/server/tag";
import { dynamicStyles } from "@/styles/dynamic";
import { formsStyles } from "@/styles/forms";
import { styles } from "@/styles/global";
import { startStyles } from "@/styles/start";

type TagItem = {
    label: string,
    value: string
}

export default function RecipeForm() {
    const { selectedImageUri, isLoading, handleThumbnail, clearThumb } = useImageRecognition();
    const userProfile = useAppSelector(state => state.profile);
    const dispatch = useAppDispatch();

    const [tags, setTags] = useState<TagItem[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [recipeTitle, setRecipeTitle] = useState('');
    const [recipeId, setRecipeId] = useState(0);
    const [isPosting, setIsPosting] = useState(false);
    const [openStepModal, setOpenModal] = useState(false);
    const [dataSteps, setDataSteps] = useState<StepRequest[]>([]);
    const [tableItems, setItems] = useState<RowItem[]>([]);

    const addStep = (step: StepRequest) => {
        if (step.isUpdating) {
            const updData = dataSteps.map(_ => _.stepNumber === step.stepNumber ? step : _);
            setDataSteps(updData);
        } else
            setDataSteps([...dataSteps, step]);
    }

    const spliceStep = (step: StepRequest) => {
        const ri = dataSteps.indexOf(step);
        dataSteps.splice(ri, 1);
    }

    function resetForm() {
        setRecipeId(0);
        setRecipeTitle('');
        setSelectedTags([]);
        setDataSteps([]);
        clearThumb();
    }

    async function saveRecipe() {
        setIsPosting(true);
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
        const request = { titulo: recipeTitle, tags: requestTags, file };
        recipeServer.save(request).then(resp => {
            switch (resp.status) {
                case 201:
                    Alert.alert("1º Etapa", "Receita salva com sucesso!");
                    setRecipeId(resp.data.seqId);
                    break;

                case 400:
                    Alert.alert("Falha no cadastro", "Preencha os campos corretamente!");
                    setIsPosting(false);
                    break;

                default:
                    Alert.alert("Erro Interno", "Tente novamente mais tarde!");
                    console.warn(`SaveRecipe Error: status -> ${resp.status} | body: ${resp.data}`);
                    setIsPosting(false);
                    break;
            }
        })
            .catch(error => {
                try {
                    if (error.response) {
                        const resp = error.response.data;
                        console.warn("Backend error response:", resp);
                        if (resp.errorMessage == "Receita Not Found!")
                            Alert.alert("Servidor demorou para responder", "Por favor, tente novamente.");
                        else
                            Alert.alert(resp.errorMessage, JSON.stringify(resp.details));
                    } else if (error.request) {
                        console.warn("No response received:", error.request);
                    } else {
                        console.warn("Error setting up request:", error.message);
                    }
                } finally {
                    setIsPosting(false);
                }
            });
    }

    async function publishRecipe() {
        recipeServer.updateStatus(recipeId)
            .then(() => {
                if (userProfile.content.length === 0)
                    Alert.alert("Fim da 2º etapa", "Parabéns pela sua primeira publicação!");
                else
                    Alert.alert("Fim da 2º etapa", "Receita publicada com sucesso!");

                resetForm();
            })
            .catch(error => {
                console.warn("Erro ao publicar receita: ", error);
                if (error.response)
                    Alert.alert("Falha ao publicar receita", error.response.data.errorMessage);
                else
                    Alert.alert("Falha ao publicar receita", "Tente novamente mais tarde!");
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

    useEffect(() => {
        dispatch(setStepNumber(dataSteps.length + 1));
        setItems(dataSteps.map(step => ({
            key: step.stepNumber.toString(),
            step: step
        })));
    }, [dataSteps]);

    return (
        <View style={styles.flex1}>
            {
                selectedImageUri ?
                    <TouchableOpacity style={styles.flex1}
                        onPress={handleThumbnail} disabled={isLoading || recipeId > 0}>
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
            <View style={[formsStyles.bottomContainer, styles.bgYellowWhite, styles.my6]}>
                <View style={[styles.flexInitial, styles.gap8]}>
                    <TextInput style={[dynamicStyles.input, styles.fontRegular]}
                        placeholder="Título da Receita" value={recipeTitle} onChangeText={setRecipeTitle}
                        editable={recipeId ? false : true} />
                    <MultiSelect
                        style={
                            recipeId ? { display: 'none' } : [formsStyles.dropdown, styles.wFull]
                        }
                        selectedStyle={[styles.rounded, { marginBottom: 0 }]}
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
                            onPress={saveRecipe} isLoading={isPosting}>
                            <Button.Title>Salvar</Button.Title>
                        </Button>
                        :
                        <GestureHandlerRootView style={[styles.my16, styles.flex1]}>
                            {tableItems.length > 0 ?
                                <DataTable tableItems={tableItems} openModal={() => setOpenModal(true)}
                                    spliceStep={spliceStep} />
                                :
                                <Text style={[styles.fontRegular, styles.textSmall, styles.selfCenter]}>
                                    Nenhum Step Adicionado
                                </Text>
                            }
                        </GestureHandlerRootView>
                    }
                </View>
                {recipeId &&
                    <>
                        <View style={[
                            startStyles.menu, styles.my16, styles.h50, styles.absolute,
                            styles.selfCenter, { bottom: -16 }
                        ]}>
                            <Button icon="add-circle-outline"
                                onPress={() => setOpenModal(true)} variant="secondary">
                                <Button.Title>Adicione</Button.Title>
                            </Button>
                            <Button btnStyle={styles.p2} icon="cloud-upload"
                                onPress={publishRecipe} >
                                <Button.Title>Publicar Receita</Button.Title>
                            </Button>
                        </View>
                        <StepCadModal
                            recipeId={recipeId}
                            openModal={openStepModal}
                            setOpenModal={setOpenModal}
                            addStep={addStep}
                        />
                    </>
                }
            </View>
        </View>
    );
}