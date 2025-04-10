import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/card";
import Tag from "@/components/tag";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRecipeId } from "@/redux/recipe/redirect";
import { ReceiptFeed } from "@/server/receipt";
import { styles } from "@/styles/global";
import { ReceiptDetails } from "./receiptDetails";

export const ReceiptCard = ({ receipt }: { receipt: ReceiptFeed }) => {
    const [showModal, setShowModal] = useState(false);
    const { isSignedIn } = useAuth();

    const redirectRecipe = useAppSelector(state => state.redirectRecipe);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (redirectRecipe.recipeId === receipt.id) {
            setShowModal(true);
        }
    }, []);

    return (
        <>
            <Pressable onPress={() => {
                if (!isSignedIn)
                    dispatch(setRecipeId(receipt.id));
                setShowModal(true);
            }}>
                <Card>
                    <Card.Img src={receipt.thumb} />
                    <Card.Content>
                        <Card.Title>{receipt.titulo}</Card.Title>
                        <View style={[styles.flexRow, styles.contentBetween]}>
                            <View style={[styles.flexInitial, styles.flexRow, { flex: .2 }]}>
                                <Ionicons name="timer" size={20} color="#AAA" />
                                <Text style={[styles.fontRegular, styles.textGray]}>
                                    {receipt.estimatedTime}
                                </Text>
                                <Text style={[styles.fontRegular, styles.textGray]}>
                                    min.
                                </Text>
                            </View>
                            <View style={[styles.flexRow, styles.flexWrap, styles.justifyEnd, { flex: .8 }]}>
                                {receipt.tags.map((category) =>
                                    <Tag key={category.id} text={category.tag} />)}
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </Pressable>
            {showModal &&
                <ReceiptDetails receipt={receipt} showModal={showModal} onClose={setShowModal} />
            }
        </>
    );
}