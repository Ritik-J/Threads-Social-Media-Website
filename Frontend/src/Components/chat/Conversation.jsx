import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { BsCheck2All } from "react-icons/bs";

//files
import userAtom from "../../Atoms/userAtom";
import { selectConversationAtom } from "../../Atoms/messageAtom";

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];
  const lastMsg = conversation.lastMessage;
  const currentUser = useRecoilValue(userAtom);
  const [selectConversation, setSelectConversation] = useRecoilState(
    selectConversationAtom
  );
  const colorMode = useColorMode();

  return (
    <Flex
      onClick={() =>
        setSelectConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          username: user.username,
          mock: conversation.mock,
        })
      }
      gap={4}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      bg={
        selectConversation?._id === conversation._id
          ? colorMode === "light"
            ? "gray.dark"
            : "gray.light"
          : ""
      }
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar size={{ base: "xs", md: "md", sm: "sm" }} src={user.profilePic}>
          {isOnline ? (
            <AvatarBadge boxSize={"1em"} bg="green.500" />
          ) : (
            <AvatarBadge boxSize={"1em"} bg="gray.500" />
          )}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"small"}>
        <Text fontWeight={700} display={"flex"} alignItems={"center"}>
          {user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text
          fontSize={"x-small"}
          display={"flex"}
          alignItems={"center"}
          gap={1}
        >
          {currentUser._id === lastMsg.sender ? (
            <Box color={lastMsg.seen ? "blue.400" : ""}>
              <BsCheck2All />
            </Box>
          ) : (
            ""
          )}

          {lastMsg.text.length > 18
            ? lastMsg.text.substring(0, 30) + "...."
            : lastMsg.text || "Image"}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
