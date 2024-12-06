import { useContext } from "react";

import { ProfileContext } from "@/redux/user/profileContext";
import { userServer } from "@/server/user";
import { userId } from "@/storage/userId";
import { Button } from "../button";
import { styles } from "@/styles/global";

export const FollowButton = () => {
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
        <Button onPress={follow} style={styles.wFull}
            variant={isFollowing ? "secondary" : "primary"}>
            <Button.Title>
                {isFollowing ? "Desseguir" : "Seguir"}
            </Button.Title>
        </Button>
    );
}