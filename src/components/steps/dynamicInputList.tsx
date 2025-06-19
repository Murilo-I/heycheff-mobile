import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { productServer, UnitMeasure } from '@/server/product';
import { formsStyles } from '@/styles/forms';
import { styles } from '@/styles/global';
import { Button } from '../button';

type TripleInputProps = {
    index: number,
    values: [string, string, string],
    onChange: (groupIndex: number, inputIndex: number, value: string) => void,
    onRemove: (groupIndex: number) => void,
    disableRemove: boolean,
    unitMeasures: UnitMeasure[]
};

const TripleInput = ({
    index,
    values,
    onChange,
    onRemove,
    disableRemove,
    unitMeasures
}: TripleInputProps) => {
    return (
        <View style={dynamicStyles.inputGroup}>
            <TextInput
                style={[dynamicStyles.input, styles.fontRegular]}
                placeholder="Ingrediente"
                value={values[0]}
                onChangeText={(text) => onChange(index, 0, text)}
            />
            <TextInput
                style={[dynamicStyles.input, styles.fontRegular]}
                inputMode="numeric"
                keyboardType="numeric"
                placeholder="Quantidade"
                value={values[1]}
                onChangeText={(text) => onChange(index, 1, text)}
            />
            <Dropdown
                style={[formsStyles.dropdown, styles.flex1]}
                selectedTextStyle={[styles.fontRegular, styles.textMedium]}
                inputSearchStyle={[styles.fontRegular, styles.h40]}
                placeholderStyle={styles.fontRegular}
                labelField="descricao"
                valueField="descricao"
                placeholder="Tipo de Medida"
                searchPlaceholder="Pesquisar..."
                maxHeight={300}
                search
                data={unitMeasures}
                value={values[2]}
                onChange={() => { }}
                renderLeftIcon={() => (
                    <MaterialCommunityIcons name="spoon-sugar" size={20} style={styles.mr8} />
                )}
            />
            <View style={dynamicStyles.removeButton}>
                <Button onPress={() => onRemove(index)} disabled={disableRemove}>
                    <Button.Title>Remover</Button.Title>
                </Button>
            </View>
        </View>
    );
};

const DynamicInputList = () => {
    const [unitMeasures, setUnitMeasures] = useState<UnitMeasure[]>([]);
    const [inputGroups, setInputGroups] = useState<[string, string, string][]>([
        ['', '', ''],
    ]);

    const handleAddGroup = () => {
        setInputGroups([...inputGroups, ['', '', '']]);
    };

    const handleRemoveGroup = (index: number) => {
        if (inputGroups.length > 1) {
            const updated = [...inputGroups];
            updated.splice(index, 1);
            setInputGroups(updated);
        }
    };

    const handleChange = (
        groupIndex: number,
        inputIndex: number,
        value: string
    ) => {
        const updatedGroups = inputGroups.map((group, i) =>
            i === groupIndex
                ? group.map((item, j) =>
                    j === inputIndex ? value : item
                ) as [string, string, string]
                : group
        );
        setInputGroups(updatedGroups);
    };

    useEffect(() => {
        productServer.getMeasures().then(result => {
            if (result) setUnitMeasures(result);
        });
    }, []);

    return (
        <ScrollView contentContainerStyle={dynamicStyles.container}>
            {inputGroups.map((values, index) => (
                <TripleInput
                    key={index}
                    index={index}
                    values={values}
                    onChange={handleChange}
                    onRemove={handleRemoveGroup}
                    disableRemove={inputGroups.length === 1}
                    unitMeasures={unitMeasures}
                />
            ))}
            <Button onPress={handleAddGroup} variant='tertiary'>
                <Button.Title>adicionar novo ingrediente</Button.Title>
            </Button>
        </ScrollView>
    );
};

const dynamicStyles = StyleSheet.create({
    container: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#999',
        marginBottom: 8,
        padding: 8,
    },
    removeButton: {
        marginTop: 8,
        alignSelf: 'flex-end',
    },
});

export default DynamicInputList;
