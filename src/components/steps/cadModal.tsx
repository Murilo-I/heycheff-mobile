import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { nextStep, resetStep, setRecipeId } from "@/redux/step/stepSlice";
import { StepRequest, stepServer } from "@/server/step";
import { styles } from "@/styles/global";
import { Alert } from "react-native";
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

    const saveStep = async () => {
        stepServer.saveStep(currentStep)
            .then(resp => {
                if (resp.status == 201) {
                    addStep(currentStep);
                    Alert.alert("2º Etapa", "Step salvo com sucesso!");
                    setOpenModal(false);
                    dispatch(resetStep());
                } else {
                    Alert.alert("Erro Interno", "Tente novamente mais tarde!");
                    console.warn(`SaveRecipe Error: status -> ${resp.status} | body: ${resp.data}`);
                }
            })
            .catch(error => {
                if (error.response) {
                    const resp = error.response;
                    console.warn('Backend error response:', resp.data);
                    Alert.alert(resp.data.errorMessage, JSON.stringify(resp.data.details));
                } else if (error.request) {
                    console.warn('No response received:', error.request);
                } else {
                    console.warn('Error setting up request:', error.message);
                }
            });
    }

    useEffect(() => {
        dispatch(setRecipeId(recipeId));
        dispatch(nextStep());
    }, []);

    useEffect(() => {
        if (currentStep.modoPreparo && currentStep.produtos.length && currentStep.video.uri
            && currentStep.timeMinutes && currentStep.stepNumber)
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
                <Button btnStyle={[styles.wFull, styles.my16]} onPress={saveStep}>
                    <Button.Title>Salvar Step</Button.Title>
                </Button>
            }
        </Modal>
    );
}