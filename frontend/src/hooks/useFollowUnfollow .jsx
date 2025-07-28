import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilState } from "recoil";

const useFollowUnfollow = (user) => {
	const [currentUser, setCurrentUser] = useRecoilState(userAtom);
	const [following, setFollowing] = useState(user?.followers?.includes(currentUser?._id));
	const [updating, setUpdating] = useState(false);
	const showToast = useShowToast();

	const handleFollowUnfollow = async () => {
		if (!currentUser) {
			showToast("Error", "Please login to follow", "error");
			return;
		}
		if (updating) return;

		setUpdating(true);
		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			if (following) {
				showToast("Success", `Unfollowed ${user.name}`, "success");
				user.followers = user.followers.filter(id => id !== currentUser._id);
			} else {
				showToast("Success", `Followed ${user.name}`, "success");
				user.followers.push(currentUser._id);
			}

			
			const updatedUser = {
				...currentUser,
				following: following
					? currentUser.following.filter(id => id !== user._id)
					: [...(currentUser.following || []), user._id],
			};
			setCurrentUser(updatedUser);
			localStorage.setItem("user-threads", JSON.stringify(updatedUser));

			setFollowing(!following);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setUpdating(false);
		}
	};

	return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
