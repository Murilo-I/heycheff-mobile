import { createContext } from "react";

import { FollowResponse } from "@/server/user";

type ProfileProps = {
    thirdPartyId?: string,
    option: "posts" | "config",
    setOption?: (menuOption: "posts" | "config") => void,
    followingIds: FollowResponse,
    setFollowingIds?: (ids: FollowResponse) => void,
    isFollowing: boolean,
    isPosts: boolean
}

export const ProfileContext = createContext<ProfileProps>({
    option: "posts",
    followingIds: { following: [] },
    isFollowing: false,
    isPosts: true
});