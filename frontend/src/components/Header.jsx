import {
  Button,
  Flex,
  Image,
  Link,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import authScreenAtom from "../atoms/authAtom";
import { MdOutlineSettings } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { IoIosMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { Tooltip } from "@chakra-ui/react";

const OverlayOne = () => (
  <ModalOverlay
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
);

const Header = () => {
  const refElem = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();
  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onClose: onLogoutClose,
  } = useDisclosure();
  const [searchUsername, setSearchUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const [icon, setIcon] = useState(true);
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const handleSearch = () => {
    refElem.current.focus();
    if (searchUsername) {
      navigate(`/${searchUsername}`);
      onSearchClose();
      setSearchUsername("");
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      } else {
        showToast("Success", "User logged out successfully", "success");
      }

      localStorage.removeItem("user-threads");
      setAuthScreen("login");

      setUser(null);
      navigate("/auth");
      onLogoutClose();
    } catch (error) {
      showToast("Error", error.message || error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}
      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("login")}
        >
          <Button
            bg={"green.300"}
            size={"sm"}
            color={"black"}
            _hover={{
              bg: "green.500",
              cursor: "pointer",
            }}
          >
            Login
          </Button>
        </Link>
      )}
      <Tooltip
        label={`${
          colorMode === "dark"
            ? "Click to get light mode"
            : "Click to get dark mode"
        }`}
        aria-label="A tooltip"
      >
        <Image
          cursor={"pointer"}
          alt="logo"
          w={6}
          src={`${colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}`}
          onClick={toggleColorMode}
        />
      </Tooltip>

      <Box display={{ base: "none", md: "block" }}>
        {user && (
          <Flex alignItems={"center"} gap={4}>
            <Tooltip label="User Profile" aria-label="A tooltip">
              <Link as={RouterLink} to={`/${user.username}`}>
                <RxAvatar size={24} />
              </Link>
            </Tooltip>
            <Tooltip label="Search" aria-label="A tooltip">
              <Link
                as={RouterLink}
                onClick={() => {
                  onSearchOpen();
                  setTimeout(() => refElem.current?.focus(), 100);
                }}
              >
                <FaSearch size={20} />
              </Link>
            </Tooltip>
            <Tooltip label="Setting" aria-label="A tooltip">
              <Link as={RouterLink} to={`/settings`}>
                <MdOutlineSettings size={20} />
              </Link>
            </Tooltip>
            <Tooltip label="Logout" aria-label="A tooltip">
              <Button size={"xs"} onClick={onLogoutOpen}>
                <FiLogOut size={20} />
              </Button>
            </Tooltip>
          </Flex>
        )}
      </Box>

      <Box
        display={{ base: "block", md: "none" }}
        onClick={() => setIcon(!icon)}
    
      >
        {icon === false ? (
          <Box zIndex={200}>
            <IoMdClose size={32} />
          </Box>
        ) : (
          <IoIosMenu size={32} />
        )}

        {!icon && user && (
          <Flex
            alignItems={"center"}
            position={"absolute"}
            right={0}
            zIndex={20}
            width="full"
            padding={6}
            justifyContent="center"
            bg={
              colorMode === "dark"
                ? "rgba(0, 0, 0, 0.85)"
                : "rgba(40,42,53,0.80)"
            }
            direction="column"
            gap={4}
            boxShadow="lg"
            borderRadius="8px"
          >
            
            <Link as={RouterLink} to={`/${user.username}`} width="100%">
              <Flex justifyContent="flex-start" ml={4} gap={4}>
                <RxAvatar size={28} color={"white"} />
                <Box fontSize="lg" color={"white"} fontWeight="bold">
                  {user.username}
                </Box>
              </Flex>
            </Link>

          
            <Link as={RouterLink} onClick={onSearchOpen} width="100%">
              <Button
                variant="ghost"
                size="lg"
                w="full"
                justifyContent="flex-start"
                _hover={{ bg: "gray.600" }}
                _focus={{ outline: "none" }}
                _active={{ transform: "scale(0.98)" }}
              >
                <FaSearch size={20} color={"white"} />
                <Box ml={4} color="white">
                  Search
                </Box>
              </Button>
            </Link>

            
            <Link as={RouterLink} to={`/settings`} width="100%">
              <Button
                variant="ghost"
                size="lg"
                w="full"
                justifyContent="flex-start"
                _hover={{ bg: "gray.600" }}
                _focus={{ outline: "none" }}
                _active={{ transform: "scale(0.98)" }}
              >
                <MdOutlineSettings size={20} color={"white"} />
                <Box ml={4} color="white">
                  Settings
                </Box>
              </Button>
            </Link>

           
            <Button
              size="lg"
              variant="solid"
              colorScheme="red"
              w="full"
              onClick={onLogoutOpen}
              justifyContent="flex-start"
              _hover={{ bg: "red.500" }}
              _focus={{ outline: "none" }}
            >
              <FiLogOut size={20} />
              <Box ml={4} color="white">
                Log Out
              </Box>
            </Button>
          </Flex>
        )}
      </Box>

      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("signup")}
        >
          <Button
            bg={"red.300"}
            size={"sm"}
            color={"black"}
            _hover={{
              bg: "red.500",
              cursor: "pointer",
            }}
          >
            Sign Up
          </Button>
        </Link>
      )}

      <Modal isOpen={isSearchOpen} onClose={onSearchClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Search for a User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex alignItems={"center"} justifyContent={"center"} gap={3}>
              <Input
                ref={refElem}
                placeholder="Enter username"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
              <Button
                onClick={handleSearch}
                bg={"red.300"}
                size={"sm"}
                color={"black"}
                _hover={{
                  bg: "red.500",
                  cursor: "pointer",
                }}
              >
                Search
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isLogoutOpen} onClose={onLogoutClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to log out?</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Close
            </Button>
            <Button
              onClick={handleLogout}
              bg={"red.400"}
              color={"white"}
              _hover={{ bg: "red.500" }}
              isLoading={loading}
            >
              Log Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Header;
