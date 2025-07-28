import {
  Button,
  Text,
  Textarea,
  Input,
  Image,
  CloseButton,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { FaRegFileImage } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const CreatePost = () => {
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const user = useRecoilValue(userAtom);
  const { username } = useParams();

  const maxlength = 200;

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ postedBy: user._id, text, img: imgUrl }),
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Post created Successfully", "success");

      if (username === user.username) {
        setPosts([data, ...posts]);
      }

      handleClose(); 
    } catch (error) {
      showToast("error", error.message || error, "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= maxlength) {
      setText(newText);
    } else {
      showToast("Error", "Character limit exceeded", "error");
    }
  };

  const handleClose = () => {
    setText("");
    setImgUrl("");
    onClose(); 
  };

  const buttonColor = useColorModeValue("gray.300", "gray.dark");
  const hoverColor = useColorModeValue("gray.400", "gray.900");

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={buttonColor}
        size={{ base: "sm", sm: "md" }}
        onClick={onOpen}
        _hover={{ bg: hoverColor }}
      >
        <AddIcon />
        <Box ml={2}>POST</Box>
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("gray.200")}>
          <ModalCloseButton />
          <ModalBody textAlign={"center"} fontSize={"xl"}>
            Create post
            <Textarea
              mt={3}
              borderColor={"blue.400"}
              _hover={{ borderColor: "blue.500" }}
              value={text}
              onChange={handleTextChange}
              placeholder="What's on your mind?"
            />
            <Text fontSize={"xs"} color={"gray.400"} textAlign={"end"}>
              {text.length}/{maxlength}
            </Text>
            <Input
              type="file"
              hidden
              ref={imageRef}
              onChange={handleImageChange}
            />
            <FaRegFileImage
              style={{ marginLeft: "5px", cursor: "pointer" }}
              size={22}
              onClick={() => imageRef.current.click()}
            />
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image
                  src={imgUrl}
                  border={"1px"}
                  borderColor={"white.500"}
                  alt="Selected Image"
                />
                <CloseButton
                  bg={buttonColor}
                  onClick={() => {
                    setImgUrl("");
                    imageRef.current.value = "";
                  }}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handleClose}>
              Close
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              _hover={{ bg: "green.500" }}
              onClick={handleCreatePost}
              isLoading={loading}
              isDisabled={!text.trim() && !imgUrl}
            >
              Add post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
