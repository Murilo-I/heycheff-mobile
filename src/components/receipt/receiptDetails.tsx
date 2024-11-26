import { Ionicons } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Image, SectionList, Text, View } from "react-native";

import { Modal } from "@/components/modal";
import { ReceiptFeed, ReceiptModal, receiptServer } from "@/server/receipt";
import { Step } from "@/server/step";
import { UserInfo, userServer } from "@/server/user";
import { styles } from "@/styles/global";
import { API_URL_MEDIA } from "@/util/endpoints";

type ReceiptDetailsProps = {
    receipt: ReceiptFeed,
    showModal: boolean,
    onClose: Dispatch<SetStateAction<boolean>>
}

export const ReceiptDetails = ({ receipt, showModal, onClose }: ReceiptDetailsProps) => {
    const [receiptModal, setReceiptModal] = useState<ReceiptModal>();
    const [owner, setOwner] = useState<UserInfo>();

    function formatData(steps: Step[] | undefined) {
        if (steps) {
            return steps.map((step, index) => ({
                title: `Passo ${index + 1}`,
                data: step.produtos.map(
                    prod => `${prod.desc} - ${prod.medida}: ${prod.unidMedida}`
                )
            }));
        } else {
            return [];
        }
    }

    useEffect(() => {
        const fetchOwner = async (userId: string) => {
            userServer.findById(userId).then(setOwner);
        }
        const fetchModal = async () => {
            receiptServer.loadModal(receipt.id).then(resp => {
                setReceiptModal(resp.data);
                fetchOwner(resp.data.userId);
            });
        }

        fetchModal();
    }, []);

    return (
        <Modal title={receipt.titulo} visible={showModal} onClose={() => onClose(false)}>
            <View style={styles.flexCenter}>
                <Ionicons name="play-circle-outline" size={40}
                    color="white" style={[styles.absolute, styles.z1]} />
                <Image source={{ uri: API_URL_MEDIA + receipt.thumb }}
                    style={[styles.flex1, styles.rounded]} />
            </View>
            <View style={[styles.flexRow, styles.contentBetween, styles.my16]}>
                <View style={[styles.flexInitial, styles.flexRow, { flex: .3 }]}>
                    <Ionicons name="timer" size={20} color="#AAA" />
                    <Text style={[styles.fontRegular, styles.textGray]}>
                        {receipt.estimatedTime}
                    </Text>
                    <Text style={[styles.fontRegular, styles.textGray]}>
                        min.
                    </Text>
                </View>
                <View style={[styles.flexRow, styles.justifyEnd, { flex: .7 }]}>
                    <Text style={styles.fontRegular}>
                        {`Chef: `}
                        <Text style={[styles.fontRegular, styles.link]}>
                            @{owner?.username}
                        </Text>
                    </Text>
                </View>
            </View>
            <View style={styles.flex1}>
                <Text style={[styles.fontRegular, styles.textXl, styles.textBold, styles.mb8]}>
                    Ingredientes
                </Text>
                <SectionList
                    sections={formatData(receiptModal?.steps)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.m8]}>
                            <Text style={styles.fontRegular}>
                                <Ionicons name="chevron-forward-circle-sharp" /> {item}
                            </Text>
                        </View>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={[styles.fontRegular, styles.textLarge]}>
                            {title}
                        </Text>
                    )}
                />
            </View>
        </Modal>
    );
}