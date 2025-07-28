import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers.jsx";
import userAtom from "../atoms/userAtom"; 

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom); 

  useEffect(() => {
    
    if (!user) {  
      navigate("/auth");
      return;
    }

   const getFeedPosts = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/posts/feed", {
      credentials: "include",
    });

    if (res.status === 401) {
      localStorage.removeItem("user-threads");
      setUser(null);
      setTimeout(() => navigate("/auth"), 0);
      return;
    }

    const data = await res.json();

    if (data.error) {
      showToast("Error", data.error, "error");
      setPosts([]);
    } else {
      setPosts(data);
    }
  } catch (error) {
    showToast("Error", error.message, "error");
    setPosts([]);
  } finally {
    setLoading(false);
  }
};


    getFeedPosts();
  }, [user, navigate, showToast, setPosts]); 

  return (
    <Flex gap="10" alignItems="flex-start">
      <Box flex={80}>
        {loading ? (
          <Flex justify="center" mt={10}>
            <Spinner size="xl" />
          </Flex>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))
        ) : (
          <Text textAlign="center" color="gray.500" mt={10}>
            No posts to display.
          </Text>
        )}
      </Box>

      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
