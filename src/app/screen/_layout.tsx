import { useState } from "react";
import { BottomNavigation, TouchableRipple } from "react-native-paper";

import { store } from "@/redux/store";
import { colors } from "@/styles/colors";
import { styles } from "@/styles/global";
import { Provider } from "react-redux";
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

    const Perfil = () => User();
    const renderScene = BottomNavigation.SceneMap({
        news: News,
        feed: Feed,
        plus: ReceiptForm,
        search: Search,
        user: Perfil
    });

    return (
        <Provider store={store}>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                barStyle={styles.bgYellowOrange}
                activeColor={colors.yellowOrange[10]}
                activeIndicatorStyle={[styles.bgRose, { width: 32 }]}
                sceneAnimationType='shifting'
                renderTouchable={({ key, ...props }) => <TouchableRipple key={key} {...props} />}
            />
        </Provider>
    );
}