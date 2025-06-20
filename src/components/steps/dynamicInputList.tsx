import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { productServer, UnitMeasure } from '@/server/product';
import { dynamicStyles } from '@/styles/dynamic';
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
                onChange={(text) => onChange(index, 2, text)}
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

export const DynamicInputList = () => {
    const [unitMeasures, setUnitMeasures] = useState<UnitMeasure[]>([]);
    const [modoPreparo, setModoPreparo] = useState("");
    const [timeMinutes, setTimeMinutes] = useState<number>();
    const [videoUri, setVideoUri] = useState("");
    const [thumbVideo, setThumbVideo] = useState("");
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

    const pickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsEditing: true,
            videoMaxDuration: 120,
            quality: 1,
        });

        if (!result.canceled) {
            const videoUri = result.assets[0].uri;
            console.log('Selected video:', videoUri);
            setVideoUri(videoUri);
            generateThumbnail(videoUri);
        }
    };

    const generateThumbnail = async (videoUri: string) => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
                videoUri, { time: 1500 }
            );
            setThumbVideo(uri);
        } catch (e) {
            console.warn(e);
        }
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
                <Button.Title>Novo ingrediente</Button.Title>
            </Button>
            <View style={styles.mt16}>
                <TextInput
                    style={[dynamicStyles.input, styles.fontRegular]}
                    multiline
                    numberOfLines={4}
                    placeholder="Modo de Preparo"
                    value={modoPreparo}
                    onChangeText={setModoPreparo}
                />
                <TextInput
                    style={[dynamicStyles.input, styles.fontRegular, styles.mb16]}
                    inputMode="numeric"
                    keyboardType="numeric"
                    placeholder="Tempo estimado"
                    value={timeMinutes ? timeMinutes.toString() : ""}
                    onChangeText={(text) => setTimeMinutes(Number.parseInt(text))}
                />
                {!thumbVideo ?
                    <Button onPress={pickVideo} variant="secondary">
                        <Button.Title>Adicione um Vídeo</Button.Title>
                    </Button>
                    :
                    <TouchableOpacity onPress={pickVideo} style={[styles.h200, styles.flex1]}>
                        <FontAwesome5 style={dynamicStyles.imgPointer}
                            name="hand-point-up" color="white" size={36} />
                        <Image source={{ uri: thumbVideo }} style={dynamicStyles.thumbnail} />
                    </TouchableOpacity>
                }
            </View>
        </ScrollView>
    );
};
