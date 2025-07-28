import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Button, useToast } from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {  Link  } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import useFollowUnfollow from "../hooks/useFollowUnfollow ";

const UserHeader = ({ user }) => {
	const toast = useToast();
  const colorMode = useColorMode()
	const currentUser = useRecoilValue(userAtom); 
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
	};

  return (
    <VStack gap={4} alignItems="start">
      <Flex justifyContent="space-between" w="full">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {user?.name}
          </Text>
          <Flex gap={3} alignItems="center">
            <Text fontSize="sm">{user?.username}</Text>
            <Text fontSize="xs" bg="gray.dark" color="#C8C8C8" p={1} borderRadius="full">
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user?.name}
            src={user?.profilePic || 'https://bit.ly/broken-link'}
            size={{ base: 'md', md: 'xl' }}
          />
        </Box>
      </Flex>

      <Text>{user.bio}.</Text>

      {currentUser?._id === user?._id ? (
        <Link to="/update">
          <Button size="sm">Update User</Button>
        </Link>
      ) : (
        <Button 
        size="sm" 
        onClick={handleFollowUnfollow} 
        isLoading={updating} 
        bg={following ? 'red.300' : 'blue.300'} 
        color="black"
        _hover={{
          bg: following ? 'red.500' : 'blue.500', 
          cursor: 'pointer',
        }}
      >
        {following ? 'Unfollow' : 'Follow'}
      </Button>
      
      )}

      <Flex w="full" justifyContent="space-between">
        <Flex gap={2} alignItems="center">
          <Text color="gray.light"> followers</Text>
          <Box w={1} h={1} bg="gray.light" borderRadius="full"></Box>
          <Link color="gray.light">instagram.com</Link>
        </Flex>

        <Flex>
          

          <Box
            p={2}
            width="40px"
            height="40px"
            borderRadius="full"
            _hover={{
              bg: colorMode === 'light' ? 'gray.500' : 'gray.600',
              cursor: 'pointer',
            }}
          >
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor="pointer" />
              </MenuButton>
              <MenuList bg={colorMode === 'dark' ? 'blue.300' : 'blue.400'}>
                <MenuItem
                  bg={colorMode === 'dark' ? 'blue.300' : 'blue.400'}
                  onClick={copyURL}
                >
                  Copy link
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w="full">
        <Flex flex={1} borderBottom="1.5px solid white" justifyContent="center" pb="3" cursor="pointer">
          <Text fontWeight="bold">Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom="1px solid gray"
          justifyContent="center"
          color="gray.light"
          pb="3"
          cursor="pointer"
        >
          <Text fontWeight="bold">Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
