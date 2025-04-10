import { useEffect, useState } from "react";
import { FlatList, NativeScrollEvent, Text, View } from "react-native";

import { Loading } from "@/components/loading";
import { ReceiptCard } from "@/components/recipe/receiptCard";
import { ReceiptFeed, receiptServer } from "@/server/receipt";
import { styles } from "@/styles/global";

export default function Feed() {
    const [receipts, setReceipts] = useState<ReceiptFeed[]>([]);
    const [totalReceipts, setTotalReceipts] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const pageSize = 4;

    async function loadReceipt() {
        return receiptServer.loadFeed(pageNum, pageSize)
            .then(feedResponse => {
                if (totalReceipts === 0) {
                    setTotalReceipts(feedResponse.data.count);
                } else {
                    setHasMore(receipts.length < totalReceipts);
                }
                setReceipts([...receipts, ...feedResponse.data.items]);
                setPageNum(pageNum + 1);
            }).catch(error => console.log(error));
    }

    function loadMore({
        layoutMeasurement,
        contentOffset,
        contentSize
    }: NativeScrollEvent) {
        const paddingToBottom = 80;
        const hitTheBottom = layoutMeasurement.height + contentOffset.y
            >= contentSize.height - paddingToBottom;

        if (hitTheBottom && hasMore) {
            setLoading(true);
            loadReceipt().then(() => setLoading(false));
        }
    }

    useEffect(() => {
        const fetchReceipt = async () => loadReceipt();
        fetchReceipt();
    }, []);

    return receipts.length ? (
        <View style={{ flex: 1, marginTop: 48 }}>
            <FlatList
                data={receipts}
                renderItem={({ item }) => <ReceiptCard receipt={item} />}
                onScroll={({ nativeEvent }) => {
                    if (!loading) loadMore(nativeEvent);
                }}
                windowSize={7}
                scrollEventThrottle={200}
                keyExtractor={receipt => receipt.id.toString()}
                ListFooterComponent={loading ? <Loading /> : null}
            />
            {!hasMore ?
                <Text style={[styles.textCenter, styles.m8, styles.fontRegular, styles.textSmall]}>
                    Sem mais receitas
                </Text> : null}
        </View>
    ) : <Loading />;
}