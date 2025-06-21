import { FontAwesome5 } from '@expo/vector-icons';
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

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentStep } from '@/redux/step/stepSlice';
import { productServer, UnitMeasure } from '@/server/product';
import { StepRequest } from '@/server/step';
import { dynamicStyles } from '@/styles/dynamic';
import { styles } from '@/styles/global';
import { Button } from '../button';
import { ProductInput } from './productInput';

export const DynamicInputList = () => {
    const [unitMeasures, setUnitMeasures] = useState<UnitMeasure[]>([]);
    const [modoPreparo, setModoPreparo] = useState("");
    const [timeMinutes, setTimeMinutes] = useState<number>();
    const [videoUri, setVideoUri] = useState("");
    const [thumbVideo, setThumbVideo] = useState("");
    const [inputGroups, setInputGroups] = useState<[string, string, string][]>([
        ['', '', ''],
    ]);

    const currentStep = useAppSelector(state => state.currentStep);
    const dispatch = useAppDispatch();

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

    useEffect(() => {
        const setState = async () => {
            if (videoUri && modoPreparo && timeMinutes && inputGroups.length) {
                const vBlob = await fetch(videoUri).then(r => r.blob());
                const produtos = inputGroups.map(group => ({
                    desc: group[0],
                    medida: Number.parseInt(group[1]),
                    unidMedida: group[2]
                }));
                const stepRequest: StepRequest = {
                    path: '',
                    thumbVideo,
                    modoPreparo,
                    produtos,
                    video: {
                        uri: videoUri,
                        name: 'thumbVideo.mp4',
                        type: vBlob.type
                    },
                    recipeId: currentStep.recipeId,
                    stepNumber: currentStep.stepNumber,
                    timeMinutes: timeMinutes ? timeMinutes : 0
                }
                dispatch(setCurrentStep(stepRequest));
            }
        }
        setState();
    }, [modoPreparo, timeMinutes, thumbVideo, inputGroups]);

    return (
        <ScrollView contentContainerStyle={dynamicStyles.container}>
            {inputGroups.map((values, index) => (
                <ProductInput
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
