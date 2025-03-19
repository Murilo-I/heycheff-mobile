import { Ionicons } from "@expo/vector-icons";
import { createVideoPlayer, VideoPlayer, VideoView } from "expo-video";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Step } from "@/server/step";
import { styles } from "@/styles/global";
import { API_URL_MEDIA } from "@/util/endpoints";
import { Button } from "../button";
import { Modal } from "../modal";

type ReceiptStepProps = {
    steps: Step[],
    showModal: boolean,
    onClose: Dispatch<SetStateAction<boolean>>
}

export const ReceiptStep = ({ steps, showModal, onClose }: ReceiptStepProps) => {
    const [activeStep, setActiveStep] = useState<Step>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [player, setPlayer] = useState<VideoPlayer>();

    const { transcript, isRecognizing, stopRecognition, clearTranscript } = useSpeechRecognition();

    function nextStep() {
        setCurrentIndex(currentIndex + 1);
    }

    function prevStep() {
        setCurrentIndex(currentIndex - 1);
    }

    function close() {
        onClose(false);
        player?.pause();
        setCurrentIndex(0);
        stopRecognition();
    }

    useEffect(() => {
        setActiveStep(steps[currentIndex]);
        let videoPath = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

        if (player === undefined) {
            setPlayer(createVideoPlayer(videoPath));
        } else {
            player.replace(videoPath);
        }
        clearTranscript
    }, [currentIndex]);

    useEffect(() => {
        console.log(transcript);
        if (transcript.includes("Hey chefe")) {
            if (transcript.includes("próximo passo")) nextStep();
            else if (transcript.includes("voltar")) prevStep();
            else if (transcript.includes("fechar")) close();
        }
    }, [transcript]);

    return (
        <Modal title={`Passo ${currentIndex + 1}`} animationType="fade"
            visible={showModal} onClose={close}>
            <View style={styles.flex1}>
                <View>
                    {player && <VideoView player={player} allowsFullscreen allowsPictureInPicture
                        style={[styles.wFull, styles.h200, styles.rounded]} />
                    }
                    <Text style={[styles.fontRegular, styles.textLarge]}>
                        {`Passo ${currentIndex + 1} de ${steps.length}`}
                    </Text>
                </View>
                <ScrollView style={styles.flex1}>
                    <View>
                        <Text style={[styles.fontRegular, styles.textLarge, styles.textBold, styles.my16]}>
                            Ingredientes
                        </Text>
                        {activeStep && activeStep.produtos.map((prod, index) => (
                            <View style={styles.m8} key={index}>
                                <Text style={styles.fontRegular}>
                                    <Ionicons name="chevron-forward-circle-sharp" />
                                    {` ${prod.desc} - ${prod.medida}: ${prod.unidMedida}`}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View>
                        <Text style={[styles.fontRegular, styles.textLarge, styles.textBold, styles.my16]}>
                            Modo de Preparo
                        </Text>
                        <Text style={[styles.fontRegular, styles.textJustify]}>
                            {activeStep?.modoPreparo}
                        </Text>
                    </View>
                </ScrollView>
                <View style={[styles.flexRow, styles.justifyBetween, styles.mt16]}>
                    <Button btnStyle={styles.w150} onPress={prevStep}
                        disabled={currentIndex === 0}>
                        <Button.Title>Voltar</Button.Title>
                    </Button>
                    <Button btnStyle={styles.w150} onPress={nextStep}
                        disabled={currentIndex === steps.length - 1}>
                        <Button.Title>Próximo Passo</Button.Title>
                    </Button>
                </View>
            </View>
        </Modal>
    );
}