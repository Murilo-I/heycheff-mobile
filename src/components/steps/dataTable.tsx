import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    TouchableOpacity,
    View
} from 'react-native';
import DraggableFlatList, {
    RenderItemParams,
} from 'react-native-draggable-flatlist';

import { useAppDispatch } from '@/redux/hooks';
import { setCurrentStep, setIsUpdating } from '@/redux/step/stepSlice';
import { StepRequest, stepServer } from '@/server/step';
import { dynamicStyles } from '@/styles/dynamic';

export type RowItem = {
    key: string;
    step: StepRequest;
};

type DataTableProps = {
    tableItems: RowItem[],
    openModal: () => void,
    spliceStep: (step: StepRequest) => void
}

export const DataTable = ({ tableItems, openModal, spliceStep }: DataTableProps) => {
    const [data, setData] = useState(tableItems);
    const dispatch = useAppDispatch();

    const removeStep = (item: RowItem) => {
        stepServer.deleteStep(item.step.stepNumber, item.step.recipeId)
            .then(() => {
                const ri = tableItems.indexOf(item);
                tableItems.splice(ri, 1);
                spliceStep(item.step);
                Alert.alert("Mudança realizada", "Step removido da lista!");
            })
            .catch(error => {
                console.warn("Erro ao excluir step: ", error);
                if (error.response)
                    Alert.alert("Falha ao excluir step", error.response.data.errorMessage);
                else
                    Alert.alert("Falha ao excluir step", "Tente novamente mais tarde!");
            });
    }

    const updateStep = (stepRequest: StepRequest) => {
        dispatch(setCurrentStep(stepRequest));
        dispatch(setIsUpdating(true));
        openModal();
    }

    useEffect(() => {
        setData(tableItems);
    }, [tableItems]);

    const renderItem = ({ item, drag, isActive }: RenderItemParams<RowItem>) => (
        <TouchableOpacity
            style={[
                dynamicStyles.row,
                { backgroundColor: isActive ? '#e0e0e0' : 'white' },
            ]}
            onLongPress={drag}
            delayLongPress={150}
            activeOpacity={0.9}
        >
            <Image source={{ uri: item.step.thumbVideo }} style={dynamicStyles.image} />
            <View style={dynamicStyles.actions}>
                <TouchableOpacity style={dynamicStyles.iconButton}
                    onPress={() => updateStep(item.step)}>
                    <FontAwesome name="edit" size={25} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={dynamicStyles.iconButton}
                    onPress={() => removeStep(item)}>
                    <FontAwesome name="trash" size={25} color="#dc3545" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <DraggableFlatList
            containerStyle={dynamicStyles.dragList}
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
        />
    );
};
