import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Alert, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetStep, setRecipeId } from "@/redux/step/stepSlice";
import { StepRequest, stepServer } from "@/server/step";
import { styles } from "@/styles/global";
import { Button } from "../button";
import { Modal } from "../modal";
import { DynamicInputList } from "./dynamicInputList";

type StepModalProp = {
    recipeId: number,
    openModal: boolean,
    setOpenModal: Dispatch<SetStateAction<boolean>>,
    addStep: (step: StepRequest) => void
}

export const StepCadModal = ({ recipeId, openModal, setOpenModal, addStep }: StepModalProp) => {
    const currentStep = useAppSelector(state => state.currentStep);
    const dispatch = useAppDispatch();

    const [enableFinalize, setEnable] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    const saveStep = async () => {
        setIsPosting(true);
        dispatch(setRecipeId(recipeId));
        stepServer.saveStep(currentStep)
            .then(resp => {
                if (resp.status == 201) {
                    addStep(currentStep);
                    Alert.alert("2º Etapa", "Step salvo com sucesso!");
                    setOpenModal(false);
                    setIsPosting(false);
                    setEnable(false);
                    dispatch(resetStep());
                } else {
                    Alert.alert("Erro Interno", "Tente novamente mais tarde!");
                    console.warn(`SaveRecipe Error: status -> ${resp.status} | body: ${resp.data}`);
                }
            })
            .catch(error => {
                if (error.response) {
                    const resp = error.response;
                    console.warn('Backend error response:', JSON.stringify(resp));
                    if (resp.data)
                        Alert.alert(resp.data.errorMessage, JSON.stringify(resp.data.details));
                    else if (resp.status === 413)
                        Alert.alert("Falha na 2º etapa", "Arquivos acima de 40MB não são permitidos.");
                    else
                        Alert.alert("Erro Interno", "Tente novamente mais tarde!");

                    setIsPosting(false);
                } else if (error.request) {
                    console.warn('No response received:', error.request);
                    setIsPosting(false);
                } else {
                    console.warn('Error setting up request:', error.message);
                    setIsPosting(false);
                }
            });
    }

    useEffect(() => {
        if (currentStep.modoPreparo && currentStep.produtos.length
            && currentStep.video.uri && currentStep.timeMinutes)
            setEnable(true);
    }, [currentStep]);

    return (
        <Modal title="Cadastrar Step" visible={openModal} onClose={() => {
            Alert.alert("Deseja fechar o modal?", "Seu progresso será perdido", [
                {
                    text: "Não",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: () => setOpenModal(false)
                }
            ]);
        }}>
            <DynamicInputList />
            {enableFinalize &&
                <View style={styles.mx16} >
                    <Button btnStyle={styles.wFull} onPress={saveStep}
                        disabled={isPosting} isLoading={isPosting} >
                        <Button.Title>Salvar Step</Button.Title>
                    </Button>
                </View>
            }
        </Modal>
    );
}