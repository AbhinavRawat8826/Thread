import {
  Button,
  Text,
  Stack,
  Heading,
  Divider,
  Flex,
  Image
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { Card, CardBody, CardFooter } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { Avatar } from "@chakra-ui/react";

const OverlayOne = () => (
  <ModalOverlay
    bg='blackAlpha.300'
    backdropFilter='blur(10px) hue-rotate(90deg)'
  />
);

export const SettingsPage = () => {
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const logout = useLogout();
  const user = useRecoilValue(userAtom);
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const freezeAccount = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        return showToast("Error", data.error, "error");
      }
      if (data.success) {
        await logout();
        showToast("Success", "Your account has been frozen", "success");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     
      <Modal isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Log out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to freeze your account?</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={freezeAccount}
              bg={"red.400"}
              color={"white"}
              _hover={{ bg: "red.500" }}
              isLoading={loading}
            >
              Freeze
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

     <Flex alignItems={'center'} justifyContent={'center'}>
     <Card maxW="sm">
        <CardBody>
          <Stack mt="6" spacing="6">
          <Flex w={"full"} alignItems={"center"} gap={3}>
                <Avatar src={user.profilePic} size={"md"} name={user.username} />
                <Flex>
                  <Text fontSize={"lg"} fontWeight={"bold"}>
                    {user.username}
                  </Text>
                  
                </Flex>
              </Flex>
            <Heading size="md"> Freeze Your Account</Heading>

            <Text my={1}>
              You can unfreeze your account anytime by logging in.
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
        
           <Flex alignItems={'center'} justifyContent={'center'}>
           <Button
              size={"sm"}
              colorScheme="red"
              bg={"red.300"}
              onClick={onOpen}
              color={"black"}
              _hover={{
                bg: "red.500",
                cursor: "pointer",
              }}
            >
              Freeze
            </Button>
           </Flex>
       
        </CardFooter>
      </Card>
     </Flex>
    </>
  );
};
