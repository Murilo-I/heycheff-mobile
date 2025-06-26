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

    const serverError = () => Alert.alert("Erro Interno", "Tente novamente mais tarde!");

    const afterPost = () => {
        addStep(currentStep);
        setOpenModal(false);
        setIsPosting(false);
        setEnable(false);
        dispatch(resetStep());
    }

    const onPostError = (error: any) => {
        try {
            if (error.response) {
                const resp = error.response;
                console.warn('Backend error response:', JSON.stringify(resp));
                if (resp.data)
                    Alert.alert(resp.data.errorMessage, JSON.stringify(resp.data.details));
                else if (resp.status === 413)
                    Alert.alert("Falha na 2º etapa", "Arquivos acima de 80MB não são permitidos.");
                else
                    serverError();
            } else if (error.request) {
                console.warn('No response received:', error.request);
            } else {
                console.warn('Error setting up request:', error.message);
            }
        } finally {
            setIsPosting(false);
        }
    }

    const saveStep = async () => {
        setIsPosting(true);
        dispatch(setRecipeId(recipeId));
        stepServer.saveStep(currentStep)
            .then(resp => {
                if (resp.status == 201) {
                    Alert.alert("2º Etapa", "Step salvo com sucesso!");
                    afterPost();
                } else {
                    serverError();
                    console.warn(`SaveRecipe Error: status -> ${resp.status} | body: ${resp.data}`);
                }
            })
            .catch(error => onPostError(error));
    }

    const updateStep = async () => {
        setIsPosting(true);
        stepServer.updateStep(currentStep)
            .then(resp => {
                if (resp.status == 200) {
                    Alert.alert("2º Etapa", "Step atualizado com sucesso!");
                    afterPost();
                } else {
                    serverError();
                    console.warn(`UpdateRecipe Error: status -> ${resp.status} | body: ${resp.data}`);
                }
            })
            .catch(error => onPostError(error));
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
                    onPress: () => {
                        setOpenModal(false);
                        dispatch(resetStep());
                    }
                }
            ]);
        }}>
            <DynamicInputList />
            {enableFinalize &&
                <View style={styles.mx16} >
                    <Button btnStyle={styles.wFull}
                        onPress={currentStep.isUpdating ? updateStep : saveStep}
                        disabled={isPosting} isLoading={isPosting} >
                        <Button.Title>Salvar Step</Button.Title>
                    </Button>
                </View>
            }
        </Modal>
    );
}