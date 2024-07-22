import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

//files
import ChatMessage from "./Message";
import "/index.css";
import MessageInput from "./MessageInput";
import useShowToast from "../../Hooks/useShowToast";
import {
  conversationAtom,
  selectConversationAtom,
} from "../../Atoms/messageAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../Atoms/userAtom";
import { useSocket } from "../../Context/SocketContext";
import messageSound from "../../Sound/notificationSound.mp3";

const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectConversation, setSelectConversation] = useRecoilState(
    selectConversationAtom
  );
  const [loadMsg, setLoadMsg] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const [conversation, setConversation] = useRecoilState(conversationAtom);
  const messageScrollRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectConversation._id === message.conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversation((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
    return () => socket.off("newMessage");
  }, [socket]);

  useEffect(() => {
    const lastMsgfromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMsgfromOtherUser) {
      socket.emit("markMsgSeen", {
        conversationId: selectConversation._id,
        userId: selectConversation.userId,
      });
    }

    socket.on("messageSeen", ({ conversationId }) => {
      if (selectConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectConversation]);

  useEffect(() => {
    messageScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessage = async () => {
      setLoadMsg(true);
      setMessages([]);
      if (selectConversation.mock) return;
      try {
        const res = await fetch(`/api/messages/${selectConversation.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        setMessages(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoadMsg(false);
      }
    };
    getMessage();
  }, [selectConversation.userId]);
  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
    >
      {/* message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2} p={2}>
        <Avatar src={selectConversation.userProfilePic} size={"sm"}></Avatar>
        <Text display={"flex"} alignItems={"center"}>
          {selectConversation.username}{" "}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />

      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        height={"400px"}
        overflow={"auto"}
      >
        {loadMsg &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loadMsg &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageScrollRef
                  : null
              }
            >
              <ChatMessage
                message={message}
                ownMessage={currentUser._id === message.sender}
              />
            </Flex>
          ))}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};
export default MessageContainer;
