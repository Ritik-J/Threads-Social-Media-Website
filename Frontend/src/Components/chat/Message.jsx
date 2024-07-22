import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { selectConversationAtom } from "../../Atoms/messageAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../../Atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";

const ChatMessage = ({ ownMessage, message }) => {
  const selectConversation = useRecoilValue(selectConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {/* if the message is sent by us  */}
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"} p={1}>
          {message.text && (
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"white"}>{message.text}</Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}

          {/* if we have message and image */}

          {message.img && !imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImageLoaded(true)}
                alt="message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {/* if image completes loading state */}

          {message.img && imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="message image" borderRadius={4} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}

          <Avatar w={7} h={7} src={user.profilePic} />
        </Flex>
      ) : (
        // if the message is sent by other user to us
        <Flex gap={2} p={1}>
          <Avatar w={7} h={7} src={selectConversation.userProfilePic} />

          {message.text && (
            <Text
              maxW={"350px"}
              bg={"gray.400"}
              p={1}
              borderRadius={"md"}
              color={"black"}
            >
              {message.text}
            </Text>
          )}

          {message.img && !imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImageLoaded(true)}
                alt="message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {/* if image completes loading state */}

          {message.img && imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="message image" borderRadius={4} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default ChatMessage;
