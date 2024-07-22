import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../Hooks/useFollowUfollow";

const UserSuggestionCard = ({ user }) => {
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  return (
    <Flex
      direction={{ base: "column", md: "row" }} // Flex direction changes based on screen size
      gap={{ base: 2, md: 4 }} // Adjusting gap between items based on screen size
      justifyContent={{ base: "center", md: "space-between" }} // Adjusting alignment based on screen size
      alignItems={{ base: "center", md: "flex-start" }} // Adjusting alignment based on screen size
      p={2} // Adding padding to the whole card
      borderBottomWidth="1px" // Adding border to visually separate cards
      borderBottomColor="gray.200" // Border color
    >
      {/* Left side */}
      <Flex gap={2} as={Link} to={`${user.username}`} alignItems="center">
        <Avatar src={user.profilePic} />
        <Box>
          <Text fontSize="sm" fontWeight="bold">
            {user.username}
          </Text>
          <Text color="gray.light" fontSize="sm">
            {user.name}
          </Text>
        </Box>
      </Flex>

      {/* Right side */}
      <Button
        size="sm"
        color={following ? "black" : "white"}
        bg={following ? "white" : "blue.400"}
        onClick={handleFollowUnfollow}
        isLoading={updating}
        _hover={{
          color: following ? "black" : "white",
          opacity: ".8",
        }}
        mt={{ base: 2, md: 0 }}
        alignSelf={{ base: "center", md: "flex-start" }}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
};

export default UserSuggestionCard;
