import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { TouchableOpacity } from "react-native";

import { ProfileContext } from "@/redux/user/profileContext";
import { styles } from "@/styles/global";

export const UserMenu = () => {
    const { setOption, isPosts } = useContext(ProfileContext);

    if (setOption) {
        return (
            <>
                <TouchableOpacity style={[
                    styles.flexHalf, styles.p8, styles.alignCenter,
                    isPosts ? styles.bgLightYellow : null
                ]}
                    onPress={() => setOption("posts")}>
                    <Ionicons name={isPosts ? 'apps' : 'apps-outline'} size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={[
                    styles.flexHalf, styles.p8, styles.alignCenter,
                    isPosts ? null : styles.bgLightYellow
                ]}
                    onPress={() => setOption("config")}>
                    <Ionicons name={isPosts ? 'settings-outline' : 'settings'} size={20} />
                </TouchableOpacity>
            </>
        );
    }
}