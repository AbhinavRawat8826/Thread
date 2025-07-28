import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Text,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import Actions from "./Actions";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import useShowToast from "../hooks/useShowToast";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("gray.300", "gray.dark");
  const replyColor = useColorModeValue("blue.600", "blue.400");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (err) {
        showToast("Error", err.message, "error");
      }
    };
    getUser();
  }, [postedBy]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");
      setPosts(posts.filter((p) => p._id !== post._id));
      showToast("Success", "Post deleted", "success");
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  if (!user) return null;
  const replies = post.replies || [];
  const followedReplies = replies.filter(reply =>
    currentUser?.following?.some(id => id?.toString() === reply.userId?.toString())
  );

  return (
    <>
      <Flex
        gap={3}
        mb={4}
        py={5}
        px={2}
        borderRadius="md"
        cursor="pointer"
        onClick={(e) => {
          if (
            e.target.closest("button") ||
            e.target.closest(".chakra-modal__content-container")
          ) return;
          navigate(`/${user.username}/post/${post._id}`);
        }}
      >
        <Flex flexDirection="column" alignItems="center">
          <Avatar
            size="md"
            name={user.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h="full" bg="gray.light" my={2}></Box>
          <Box position="relative" h="40px" w="25px">
            {replies.length === 0 ? (
              <Text textAlign="center">😴</Text>
            ) : followedReplies.length > 0 ? (
              [...new Map(followedReplies.map(r => [r.username, r])).values()]
                .slice(0, 2)
                .map((reply, index) => (
                  <Avatar
                    key={index}
                    size="xs"
                    name={reply.username}
                    src={reply.userProfilePic || "https://bit.ly/broken-link"}
                    position="absolute"
                    bottom={index === 0 ? "0" : undefined}
                    top={index === 1 ? "0" : undefined}
                    left={index === 1 ? "15px" : "0"}
                    padding="2px"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/${reply.username}`);
                    }}
                  />
                ))
            ) : (
              <Text>😊</Text>
            )}
          </Box>
        </Flex>

        <Flex flex={1} flexDirection="column" gap={2}>
          <Flex justifyContent="space-between">
            <Flex alignItems="center">
              <Text
                fontSize="sm"
                fontWeight="bold"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/${user.username}`);
                }}
              >
                {user.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems="center">
              <Text fontSize="xs" color="gray.light">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === user._id && (
                <Button
                  size="sm"
                  bg={bg}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpen();
                  }}
                >
                  <DeleteIcon />
                </Button>
              )}
            </Flex>
          </Flex>

          <Text fontSize="md">{post.text}</Text>

          {post.img && (
            <Box borderRadius={6} overflow="hidden">
              <Image src={post.img} w="full" />
            </Box>
          )}

          <Actions post={post} />

          <Flex gap={3} my={1}>
            {replies.length === 0 ? (
              <Text fontSize="sm" color="gray.light">No comments yet</Text>
            ) : followedReplies.length > 0 ? (
              <Text fontSize="sm" color={replyColor}>
                {[...new Set(followedReplies.map(r => r.username))].join(", ")} has commented on this post
              </Text>
            ) : (
              <Text fontSize="sm"></Text>
            )}
          </Flex>
        </Flex>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this post?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" onClick={handleDeletePost}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Post;
