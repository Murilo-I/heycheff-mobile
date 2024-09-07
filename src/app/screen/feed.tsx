import { Timer } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, NativeScrollEvent, Text, View } from "react-native";

import { Card } from "@/components/card";
import Tag from "@/components/tag";
import { ReceiptFeed, receiptServer } from "@/server/receipt";

export default function Feed() {
    const [receipts, setReceipts] = useState<ReceiptFeed[]>([]);
    const [totalReceipts, setTotalReceipts] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const pageSize = 4;

    async function loadReceipt() {
        await receiptServer.loadFeed(pageNum, pageSize)
            .then(feedResponse => {
                if (totalReceipts === 0)
                    setTotalReceipts(feedResponse.data.count);

                setReceipts([...receipts, ...feedResponse.data.items]);
                setHasMore(receipts.length < totalReceipts);
            }).catch(error => console.log(error));
    }

    async function loadMore({
        layoutMeasurement,
        contentOffset,
        contentSize }: NativeScrollEvent) {

        const paddingToBottom = 50;
        const hitTheBottom = layoutMeasurement.height + contentOffset.y
            >= contentSize.height - paddingToBottom;

        if (hitTheBottom && hasMore) {
            setPageNum(pageNum + 1);
            setLoading(true);
            await loadReceipt();
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchReceipt = async () => await loadReceipt();
        fetchReceipt();
    }, []);

    return (
        <View>
            <FlatList
                data={receipts}
                renderItem={({ item }) => <ReceiptCard receipt={item} />}
                onScroll={({ nativeEvent }) => async () => {
                    if (!loading) await loadMore(nativeEvent);
                }}
                scrollEventThrottle={250}
                keyExtractor={receipt => receipt.id.toString()}
            />
            {loading ? <ActivityIndicator />
                : ""}
            {!hasMore ?
                <Text>
                    Sem mais receitas
                </Text> : ""}
        </View>
    );
}

const ReceiptCard = ({ receipt }: { receipt: ReceiptFeed }) => {
    return (
        <Card>
            <Card.Img src={receipt.thumb} />
            <Card.Content>
                <Card.Title>{receipt.titulo}</Card.Title>
                <View>
                    <View>
                        <Timer size={20} />
                        <Text>
                            {receipt.estimatedTime}
                        </Text>
                    </View>
                    {receipt.tags.map((category) =>
                        <Tag key={category.id} text={category.tag} />)}
                </View>
            </Card.Content>
        </Card>
    );
}