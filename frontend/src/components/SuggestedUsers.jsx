import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";

const SuggestedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/suggested", {
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
          
            localStorage.removeItem("user-threads");
            setTimeout(() => navigate("/auth"), 0);
            return;
          }
          const errorData = await res.json();
          showToast("Error", errorData.error || "Something went wrong", "error");
          return;
        }

        const data = await res.json();
        setSuggestedUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        showToast("Error", error.message || "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers();
  }, [showToast, navigate]);

  return (
    <>
      <Text mb={4} fontWeight="bold">
        Suggested Users
      </Text>
      <Flex direction="column" gap={4}>
        {loading
          ? [0, 1, 2, 3, 4, 5].map((_, idx) => (
              <Flex
                key={idx}
                gap={2}
                alignItems="center"
                p="1"
                borderRadius="md"
                bg="gray.50"
              >
                
                <Box>
                  <SkeletonCircle size="10" />
                </Box>

               
                <Flex w="full" flexDirection="column" gap={2}>
                  <Skeleton h="8px" w="80px" />
                  <Skeleton h="8px" w="90px" />
                </Flex>

              
                <Skeleton h="20px" w="60px" />
              </Flex>
            ))
          : suggestedUsers.map(
            (user) =>
              user && <SuggestedUser key={user._id} user={user} />
          )}
      </Flex>
    </>
  );
};

export default SuggestedUsers;
