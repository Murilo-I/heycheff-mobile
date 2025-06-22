import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    TextInput,
    View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { UnitMeasure } from '@/server/product';
import { dynamicStyles } from '@/styles/dynamic';
import { formsStyles } from '@/styles/forms';
import { styles } from '@/styles/global';
import { Button } from '../button';

type ProductInputProps = {
    index: number,
    values: [string, string, string],
    onChange: (groupIndex: number, inputIndex: number, value: string) => void,
    onRemove: (groupIndex: number) => void,
    disableRemove: boolean,
    unitMeasures: UnitMeasure[]
};

export const ProductInput = ({
    index,
    values,
    onChange,
    onRemove,
    disableRemove,
    unitMeasures
}: ProductInputProps) => {
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
                onChange={(text) => onChange(index, 2, text.descricao)}
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