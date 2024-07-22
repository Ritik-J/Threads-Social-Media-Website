//material-ui
import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";

//react-icon
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

//library
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";

//files
import userAtom from "../Atoms/userAtom";
import useFollowUnfollow from "../Hooks/useFollowUfollow";

function UserHeader({ user }) {
  const { colorMode } = useColorMode();
  const toast = useToast();

  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({ description: "url copied to clipboard", duration: 3000 });
    });
  };

  // Get current user from Recoil state
  const currentUser = useRecoilValue(userAtom);

  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  return (
    <VStack spacing={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"small"}>{user.username}</Text>
            <Text
              fontSize={"x-small"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>

        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}

          {!user.profilePic && ( //if user does not have profile pic
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {currentUser._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>update Profile</Button>
        </Link>
      )}

      {currentUser?._id !== user._id && (
        <Button onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}> {user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex gap={2}>
          <Box>
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.light"} onClick={copyUrl}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          w={"50%"}
          borderBottom={
            colorMode === "dark"
              ? "1.5px solid whiteSmoke "
              : "1.5px solid #1e1e1e"
          }
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          w={"50%"}
          borderBottom={
            colorMode === "dark" ? "1px solid Gray " : "1px solid darkGray"
          }
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}

export default UserHeader;
