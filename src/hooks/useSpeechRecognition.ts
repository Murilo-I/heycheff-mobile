import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import { useEffect, useState } from "react";

export const useSpeechRecognition = () => {
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [transcript, setTranscript] = useState("");

    useSpeechRecognitionEvent("start", () => setIsRecognizing(true));
    useSpeechRecognitionEvent("end", () => setIsRecognizing(false));
    useSpeechRecognitionEvent("result", event => setTranscript(event.results[0]?.transcript));
    useSpeechRecognitionEvent("error", event => console.log(
        `error.code: ${event.error} - error.message: ${event.message}`
    ));

    const stopRecognition = () => {
        ExpoSpeechRecognitionModule.stop();
    }

    const clearTranscript = () => {
        setTranscript("");
    }

    useEffect(() => {
        const startRecognition = async () => {
            const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();

            if (!result.granted) {
                console.warn("Permissions not granted", result);
                return;
            }

            ExpoSpeechRecognitionModule.start({
                lang: 'pt-BR',
                interimResults: true,
                maxAlternatives: 1,
                continuous: true,
                requiresOnDeviceRecognition: false,
                addsPunctuation: false,
                volumeChangeEventOptions: {
                    enabled: true,
                    intervalMillis: 300
                },
                contextualStrings: ['heycheff', 'próximo passo', 'voltar', 'fechar']
            });
        }
        startRecognition();
    }, []);

    return {
        transcript,
        isRecognizing,
        stopRecognition,
        clearTranscript,
    }
}