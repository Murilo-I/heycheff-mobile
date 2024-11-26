import { Ionicons } from "@expo/vector-icons";
import { ModalProps, Pressable, Modal as RNModal, Text, View } from "react-native";

import { styles } from "@/styles/global";

type Props = ModalProps & {
    title: string
    onClose?: () => void
}

export function Modal({ title, onClose, children, ...rest }: Props) {
    return (
        <RNModal animationType="slide" {...rest} transparent>
            <View style={[styles.flex1, styles.bgYellowWhite, styles.p12]}>
                <View style={[styles.flexRow, styles.justifyBetween]}>
                    <Text style={[styles.fontRegular, styles.textLarge]}>
                        {title}
                    </Text>
                    {onClose && (
                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={30} />
                        </Pressable>
                    )}
                </View>
                {children}
            </View>
        </RNModal>
    );
}