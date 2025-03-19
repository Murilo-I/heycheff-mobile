import { useState } from "react";
import { FlatList, Image, NativeScrollEvent, View } from "react-native";

import { Loading } from "@/components/loading";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addContent, increasePage } from "@/redux/user/profileSlice";
import { ReceiptFeed, receiptServer } from "@/server/receipt";
import { userId } from "@/storage/userId";
import { styles } from "@/styles/global";
import { API_URL_MEDIA } from "@/util/endpoints";

export default function Posts() {
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalReceipts, setTotalReceipts] = useState(0);

    const userProfile = useAppSelector(state => state.profile);
    const dispatch = useAppDispatch();
    const pageSize = 6;
    const numColumns = 3;

    async function loadMore({
        layoutMeasurement,
        contentOffset,
        contentSize
    }: NativeScrollEvent) {
        const paddingToBottom = 80;
        const hitTheBottom = layoutMeasurement.height + contentOffset.y
            >= contentSize.height - paddingToBottom;

        if (hitTheBottom && hasMore) {
            setLoading(true);
            const id = await userId.get();

            if (totalReceipts === 0) {
                dispatch(increasePage());
                dispatch(increasePage());
            }

            receiptServer.loadFeed(userProfile.contentPage, pageSize, id)
                .then(feedResponse => {
                    if (totalReceipts === 0) {
                        setTotalReceipts(feedResponse.data.count);
                    } else {
                        setHasMore(userProfile.content.length < totalReceipts);
                    }
                    dispatch(addContent(feedResponse.data.items));
                    dispatch(increasePage());
                    setLoading(false);
                }).catch(error => console.log(error));
        }
    }

    function handleLayout(data: ReceiptFeed[]) {
        const numberOfFullRows = Math.floor(data.length / numColumns);
        let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
        const newData = [...data];

        while (numberOfElementsLastRow !== numColumns
            && numberOfElementsLastRow !== 0) {
            newData.push({
                id: (-1 * numberOfElementsLastRow),
                thumb: '',
                titulo: 'empty',
                tags: [],
                estimatedTime: 0
            });
            numberOfElementsLastRow += 1;
        }

        return newData;
    }

    return (
        <View style={styles.flex1}>
            <FlatList
                numColumns={numColumns}
                contentContainerStyle={styles.postGrid}
                data={handleLayout(userProfile.content)}
                renderItem={({ item }) => {
                    const uri = `${API_URL_MEDIA}${item.thumb}`;
                    return <Image key={item.id} style={styles.postImage} source={{ uri }} />
                }}
                onScroll={({ nativeEvent }) => {
                    if (!loading) loadMore(nativeEvent);
                }}
                scrollEventThrottle={200}
                keyExtractor={receipt => receipt.id.toString()}
                ListFooterComponent={loading ? <Loading /> : null}
            />
        </View>
    );
}