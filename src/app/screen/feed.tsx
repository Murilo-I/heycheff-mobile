import { Timer } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, NativeScrollEvent, Text, View } from "react-native";

import { Card } from "@/components/card";
import { Loading } from "@/components/loading";
import Tag from "@/components/tag";
import { ReceiptFeed, receiptServer } from "@/server/receipt";
import { styles } from "@/styles/global";

export default function Feed() {
    const [receipts, setReceipts] = useState<ReceiptFeed[]>([]);
    const [totalReceipts, setTotalReceipts] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const pageSize = 4;

    function loadReceipt() {
        receiptServer.loadFeed(pageNum, pageSize)
            .then(feedResponse => {
                if (totalReceipts === 0)
                    setTotalReceipts(feedResponse.data.count);
                else
                    setHasMore(receipts.length < totalReceipts);

                setReceipts([...receipts, ...feedResponse.data.items]);
                setPageNum(pageNum + 1);
            }).catch(error => console.log(error));
    }

    function loadMore({
        layoutMeasurement,
        contentOffset,
        contentSize }: NativeScrollEvent) {

        const paddingToBottom = 20;
        const hitTheBottom = layoutMeasurement.height + contentOffset.y
            >= contentSize.height - paddingToBottom;

        if (hitTheBottom && hasMore) {
            setLoading(true);
            loadReceipt();
            setLoading(false);
        }
    }

    useEffect(() => loadReceipt(), []);

    return (
        <View style={{ flex: 1, marginTop: 48 }}>
            <FlatList
                data={receipts}
                renderItem={({ item }) => <ReceiptCard receipt={item} />}
                onScroll={({ nativeEvent }) => {
                    if (!loading) loadMore(nativeEvent);
                }}
                scrollEventThrottle={100}
                keyExtractor={receipt => receipt.id.toString()}
            />
            {loading ? <Loading />
                : <></>}
            {!hasMore ?
                <Text style={[styles.textCenter, styles.m8, styles.fontRegular, styles.textSmall]}>
                    Sem mais receitas
                </Text> : <></>}
        </View>
    );
}

const ReceiptCard = ({ receipt }: { receipt: ReceiptFeed }) => {
    return (
        <Card>
            <Card.Img src={receipt.thumb} />
            <Card.Content>
                <Card.Title>{receipt.titulo}</Card.Title>
                <View style={[styles.flexRow, styles.contentBetween]}>
                    <View style={[styles.flexInitial, styles.flexRow, { flex: .2 }]}>
                        <Timer size={20} color="#AAA" />
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
    );
}