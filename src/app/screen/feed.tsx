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
        <View className="h-screen flex-1 flex-col px-5">
            <FlatList
                data={receipts}
                renderItem={({ item }) => <ReceiptCard receipt={item} />}
                onScroll={({ nativeEvent }) => async () => {
                    if (!loading) await loadMore(nativeEvent);
                }}
                scrollEventThrottle={250}
                keyExtractor={receipt => receipt.id.toString()}
            />
            {loading ? <ActivityIndicator className="text-yellowOrange-100 my-4" />
                : ""}
            {!hasMore ?
                <Text className="font-regular text-sm text-gray-400 my-4">
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
                <View className="flex-row content-between">
                    <View className="flex-initial text-gray-500">
                        <Timer size={20} />
                        <Text className="font-regular">
                            {receipt.estimatedTime}
                        </Text>
                    </View>
                    {receipt.tags.map(category =>
                        <Tag text={category.tag} />)}
                </View>
            </Card.Content>
        </Card>
    );
}