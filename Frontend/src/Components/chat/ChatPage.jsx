import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdOutlinePersonSearch } from "react-icons/md";
import Conversation from "./Conversation";
import { GiConversation } from "react-icons/gi";
import { useEffect, useState } from "react";

//files
import MessageContainer from "./MessageContainer";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationAtom,
  selectConversationAtom,
} from "../../Atoms/messageAtom";
import userAtom from "../../Atoms/userAtom";
import { useSocket } from "../../Context/SocketContext";
import useShowToast from "../../Hooks/useShowToast";

const ChatPage = () => {
  const [loadConversation, setLoadConversation] = useState(true);
  const [searchConvo, setSearchConvo] = useState("");
  const [conversation, setConversation] = useRecoilState(conversationAtom);
  const [selectConversation, setSelectConversation] = useRecoilState(
    selectConversationAtom
  );
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversation((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversation]);

  useEffect(() => {
    const getConvo = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          console.log(data.error);
          return;
        }
        setConversation(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadConversation(false);
      }
    };
    getConvo();
  }, [setConversation]);

  const handelSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/profile/${searchConvo}`);
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
      }

      //if user try to search themselves
      if (data._id === currentUser._id) {
        showToast("Error", "You Cannot Search and Message Yourself", "error");
      }

      //if user is already in a conversation with searchuser or displayed in message list
      const conversationAlreadyExists = conversation.find(
        (conversation) => conversation.participants[0]._id === data._id
      );

      if (conversationAlreadyExists) {
        setSelectConversation({
          _id: conversationAlreadyExists._id,
          userId: data._id,
          username: data.username,
          userProfilePic: data.profilePic,
        });
        return;
      }

      //mock conversation when user try to someone who does not exist
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: data._id,
            username: data.username,
            profilePic: data.profilePic,
          },
        ],
      };
      setConversation((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      transform={"auto"}
      translateX={"-50%"}
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        mx={"auto"}
        maxW={{ sm: "400px", md: "full" }}
      >
        <Flex
          flex={40}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            your conversation
          </Text>
          <form onSubmit={handelSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="search for user"
                position={"relative"}
                pl={10}
                onChange={(e) => setSearchConvo(e.target.value)}
                // value={searchConvo}
              />
              <Button
                onClick={handelSearch}
                size={"md"}
                position={"absolute"}
                bg={"transparent"}
                p={0}
                display={"flexbox"}
              >
                <MdOutlinePersonSearch
                  onClick={handelSearch}
                  color={useColorModeValue("#1e1e1e", "white")}
                  height={"full"}
                  size={30}
                />
              </Button>
            </Flex>
          </form>

          {loadConversation &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadConversation &&
            conversation.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
                conversation={conversation}
              />
            ))}
        </Flex>

        {/* if we do not have any selected conversation  */}
        {!selectConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            justifyContent={"center"}
            alignItems={"center"}
            p={2}
            flexDir={"column"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>select a user to start a conversation</Text>
          </Flex>
        )}

        {/* if we have selected conversation */}
        {selectConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
