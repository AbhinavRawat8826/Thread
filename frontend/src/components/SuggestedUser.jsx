import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from '../hooks/useFollowUnfollow '

const SuggestedUser = ({ user }) => {
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	return (
		<Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			
			<Flex gap={2} as={Link} to={`${user.username}`}>
				<Avatar src={user.profilePic} />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{user.username}
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
						{user.name}
					</Text>
				</Box>
			</Flex>
			
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
		</Flex>
	);
};

export default SuggestedUser;

