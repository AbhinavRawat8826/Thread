import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Comment = ({ reply, lastReply }) => {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    e.stopPropagation(); 
    navigate(`/${reply.username}`);
  };

  return (
    <Flex
      py={2}
      borderBottom={lastReply ? "none" : "1px solid"}
      borderColor="gray.light"
      alignItems="center"
      gap={3}
    >
      <Avatar
        size="sm"
        src={reply.userProfilePic || "https://bit.ly/broken-link"}
        name={reply.username}
        cursor="pointer"
        onClick={handleNavigate}
      />

      <Box>
        <Text
          fontWeight="bold"
          fontSize="sm"
          cursor="pointer"
          onClick={handleNavigate}
        >
          {reply.username}
        </Text>
        <Text fontSize="sm">{reply.text}</Text>
      </Box>
    </Flex>
  );
};

export default Comment;
