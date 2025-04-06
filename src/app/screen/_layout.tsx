import { useState } from "react";
import { BottomNavigation, TouchableRipple } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setNavIndex } from "@/redux/nav/navigationSlice";
import { colors } from "@/styles/colors";
import { styles } from "@/styles/global";
import Feed from "./feed";
import ReceiptForm from "./form/receipt";
import News from "./news";
import Search from "./search";
import User from "./user";

export default function Layout() {
    const index = useAppSelector(state => state.navigation.index);
    const thirdParty = useAppSelector(state => state.thirdParty);
    const dispatch = useAppDispatch();
    const [routes] = useState([
        { key: 'news', title: 'Novidade', focusedIcon: 'gift', unfocusedIcon: 'gift-outline' },
        { key: 'feed', title: 'Feed', focusedIcon: 'image-multiple', unfocusedIcon: 'image-multiple-outline' },
        { key: 'plus', title: 'Adicionar', focusedIcon: 'plus-circle' },
        { key: 'search', title: 'Pesquisar', focusedIcon: 'card-search', unfocusedIcon: 'card-search-outline' },
        { key: 'user', title: 'Perfil', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
    ]);

    const Perfil = () => User(thirdParty.profileId);
    const renderScene = BottomNavigation.SceneMap({
        news: News,
        feed: Feed,
        plus: ReceiptForm,
        search: Search,
        user: Perfil
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={index => dispatch(setNavIndex(index))}
            renderScene={renderScene}
            barStyle={styles.bgYellowOrange}
            activeColor={colors.yellowOrange[10]}
            activeIndicatorStyle={[styles.bgRose, { width: 32 }]}
            sceneAnimationType='shifting'
            renderTouchable={({ key, ...props }) => <TouchableRipple key={key} {...props} />}
        />
    );
}