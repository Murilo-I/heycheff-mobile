import { useState } from "react";
import { BottomNavigation } from "react-native-paper";

import { colors } from "@/styles/colors";
import { styles } from "@/styles/global";
import Feed from "./feed";
import ReceiptForm from "./form/receipt";
import News from "./news";
import Search from "./search";
import User from "./user";

export default function Layout() {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'news', title: 'Novidade', focusedIcon: 'gift', unfocusedIcon: 'gift-outline' },
        { key: 'feed', title: 'Feed', focusedIcon: 'image-multiple', unfocusedIcon: 'image-multiple-outline' },
        { key: 'plus', title: 'Adicionar', focusedIcon: 'plus-circle' },
        { key: 'search', title: 'Pesquisar', focusedIcon: 'card-search', unfocusedIcon: 'card-search-outline' },
        { key: 'user', title: 'Perfil', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        news: News,
        feed: Feed,
        plus: ReceiptForm,
        search: Search,
        user: User
    });

    return <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={styles.bgYellowOrange}
        activeColor={colors.yellowOrange[10]}
        activeIndicatorStyle={[styles.bgRose, { width: 32 }]}
        sceneAnimationType='shifting'
    />
}