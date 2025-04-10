import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Image, Pressable, SectionList, Text, View } from "react-native";

import { Modal } from "@/components/modal";
import { useAppDispatch } from "@/redux/hooks";
import { setNavIndex, tabs } from "@/redux/nav/navigationSlice";
import { set3PartyProfileId } from "@/redux/user/thirdPartySlice";
import { ReceiptFeed, ReceiptModal, receiptServer } from "@/server/receipt";
import { Step } from "@/server/step";
import { UserInfo, userServer } from "@/server/user";
import { styles } from "@/styles/global";
import { API_URL_MEDIA } from "@/util/endpoints";
import { ReceiptStep } from "./receiptStep";

type ReceiptDetailsProps = {
    receipt: ReceiptFeed,
    showModal: boolean,
    onClose: Dispatch<SetStateAction<boolean>>
}

export const ReceiptDetails = ({ receipt, showModal, onClose }: ReceiptDetailsProps) => {
    const [receiptModal, setReceiptModal] = useState<ReceiptModal>();
    const [owner, setOwner] = useState<UserInfo>();
    const [showStepModal, setShowStepModal] = useState(false);
    const dispatch = useAppDispatch();

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

    function show3PartyProfile() {
        dispatch(set3PartyProfileId(receiptModal?.userId));
        dispatch(setNavIndex(tabs.PERFIL));
        router.navigate('/screen/user');
        onClose(false);
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
            <Pressable style={styles.flexCenter} onPress={() => setShowStepModal(true)}>
                <Ionicons name="play-circle-outline" size={40}
                    color="white" style={[styles.absolute, styles.z1]} />
                <Image source={{ uri: API_URL_MEDIA + receipt.thumb }}
                    style={[styles.flex1, styles.rounded]} />
            </Pressable>
            {
                receiptModal && <ReceiptStep steps={receiptModal.steps}
                    showModal={showStepModal} onClose={setShowStepModal} />
            }
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
                        <Pressable onPress={show3PartyProfile}>
                            <Text style={[styles.fontRegular, styles.link]}>
                                @{owner?.username}
                            </Text>
                        </Pressable>
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
                        <View style={styles.m8}>
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