// message input filed for the user to send message while chatting

import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSend, IoSendSharp } from "react-icons/io5";
import { useRecoilState, useRecoilValue } from "recoil";
//files
import useShowToast from "../../Hooks/useShowToast";
import {
  conversationAtom,
  selectConversationAtom,
} from "../../Atoms/messageAtom";
import { BsFillImageFill } from "react-icons/bs";
import UseImage from "../../Hooks/useImage";

const MessageInput = ({ setMessages }) => {
  const showToast = useShowToast();
  const [messageText, setMessageText] = useState("");
  const selectConversation = useRecoilValue(selectConversationAtom);
  const [conversation, setConversation] = useRecoilState(conversationAtom);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleChangeImage, imageUrl, setImageUrl } = UseImage();
  const [isSending, setIsSending] = useState(false);

  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (!messageText && !imageUrl) return;
    if (isSending) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectConversation.userId,
          img: imageUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      }

      setMessages((messages) => [...messages, data]);
      setMessageText("");
      setConversation((prevconv) => {
        const updateConversation = prevconv.map((conversation) => {
          if (conversation._id === selectConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updateConversation;
      });
      setImageUrl("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMsg} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder="type a message"
            borderColor={useColorModeValue("gray.dark", "gray.light")}
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement onClick={handleSendMsg} cursor={"pointer"}>
            <IoSend />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input
          type={"file"}
          hidden
          ref={imageRef}
          onChange={handleChangeImage}
        />
      </Flex>
      <Modal
        isOpen={imageUrl}
        onClose={() => {
          onClose();
          setImageUrl("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imageUrl} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <IoSendSharp
                  size={24}
                  cursor={"pointer"}
                  onClick={handleSendMsg}
                />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
