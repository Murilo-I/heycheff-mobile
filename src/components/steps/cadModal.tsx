import { Dispatch, SetStateAction } from "react";

import { Modal } from "../modal";
import DynamicInputList from "./dynamicInputList";

type StepModalProp = {
    openModal: boolean,
    setOpenModal: Dispatch<SetStateAction<boolean>>
}

export const StepCadModal = ({ openModal, setOpenModal }: StepModalProp) => {
    return (
        <Modal title="Cadastrar Step" visible={openModal} onClose={() => setOpenModal(false)}>
            <DynamicInputList />
        </Modal>
    );
}