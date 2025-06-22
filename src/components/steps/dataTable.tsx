import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Image,
    TouchableOpacity,
    View
} from 'react-native';
import DraggableFlatList, {
    RenderItemParams,
} from 'react-native-draggable-flatlist';

import { dynamicStyles } from '@/styles/dynamic';

export type RowItem = {
    key: string;
    imageUri: string;
};

export const DataTable = ({ tableItems }: { tableItems: RowItem[] }) => {
    const [data, setData] = useState(tableItems);

    useEffect(() => {
        setData(tableItems);
    }, [tableItems]);

    const renderItem = ({ item, drag, isActive }: RenderItemParams<RowItem>) => (
        <TouchableOpacity
            style={[
                dynamicStyles.row,
                { backgroundColor: isActive ? '#e0e0e0' : 'white' },
            ]}
            onLongPress={drag}
            delayLongPress={150}
            activeOpacity={0.9}
        >
            <Image source={{ uri: item.imageUri }} style={dynamicStyles.image} />
            <View style={dynamicStyles.actions}>
                <TouchableOpacity style={dynamicStyles.iconButton} onPress={() => console.log('Edit', item.key)}>
                    <FontAwesome name="edit" size={25} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={dynamicStyles.iconButton} onPress={() => console.log('Delete', item.key)}>
                    <FontAwesome name="trash" size={25} color="#dc3545" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <DraggableFlatList
            containerStyle={{ flexGrow: 1, maxHeight: 175 }}
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
        />
    );
};
