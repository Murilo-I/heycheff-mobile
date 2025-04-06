import { useContext } from "react";

import { ProfileContext } from "@/redux/user/profileContext";
import { userServer } from "@/server/user";
import { userId } from "@/storage/userId";
import { Button } from "../button";
import { styles } from "@/styles/global";

type Props = { disabled?: boolean };

export const FollowButton = ({ disabled }: Props) => {
    const { thirdPartyId, isFollowing, setFollowingIds } = useContext(ProfileContext);

    const follow = () => {
        userId.get().then(userId => {
            if (userId && thirdPartyId) {
                userServer.follow(userId, thirdPartyId)
                    .then(setFollowingIds);
            }
        });
    }

    return (
        <Button onPress={follow} style={styles.wFull} containerStyle={styles.wFull} disabled={disabled}
            variant={isFollowing ? "secondary" : "primary"}>
            <Button.Title>
                {isFollowing ? "Deixar de Seguir" : "Seguir"}
            </Button.Title>
        </Button>
    );
}