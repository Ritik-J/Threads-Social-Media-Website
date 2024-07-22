import {AddIcon} from "@chakra-ui/icons";
import {
    Button,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    Textarea,
    Text,
    Input,
    Flex,
    Image,
    CloseButton,
} from "@chakra-ui/react";
import {useRef, useState} from "react";
import UseImage from "../Hooks/useImage";
import {BsFillImageFill} from "react-icons/bs";
import {useRecoilState, useRecoilValue} from "recoil";
import userAtom from "../Atoms/userAtom";
import useShowToast from "../Hooks/useShowToast";
import postsAtom from "../Atoms/PostsAtom";
import {useParams} from "react-router-dom"

function CreatePost() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {handleChangeImage, imageUrl, setImageUrl} = UseImage();
    const imageRef = useRef();
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [posts, setposts] = useRecoilState(postsAtom)

    const [postText, setPostText] = useState("");
    const [remaningChar, setRemaningChar] = useState(500);
    const [loading, setLoading] = useState(false);
    const {username} = useParams()

    const handleTextChange = (e) => {
        const inputText = e.target.value;
        if (inputText.length > 500) {
            const shortenText = inputText.slice(0, 500);
            setPostText(shortenText);
            setRemaningChar(0);
        } else {
            setPostText(inputText);
            setRemaningChar(500 - inputText.length);
        }
    };

    const handleCreatePost = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({postedBy: user._id, text: postText, img: imageUrl}),
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("success", "post created", "success");
            if (username === user.username) {
                
                setposts([data, ...posts])
            }
            onClose();
            setPostText("");
            setImageUrl("");
        } catch (error) {
            showToast("Error", error, "error");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <Button
                position={"fixed"}
                bottom={10}
                right={10}
                leftIcon={<AddIcon />}
                bg={useColorModeValue("gray.300", "gray.dark")}
                onClick={onOpen}
            >
                Post
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea placeholder="share your post" onChange={handleTextChange} value={postText} />
                            <Text
                                fontSize={"small"}
                                fontWeight={"bold"}
                                textAlign={"right"}
                                m={1}
                                color={useColorModeValue("gray.dark", "whitesmoke")}
                            >
                                {remaningChar}/500
                            </Text>

                            <Input type="file" hidden ref={imageRef} onChange={handleChangeImage} />

                            <BsFillImageFill
                                style={{marginLeft: "5px", cursor: "pointer"}}
                                size={16}
                                onClick={() => imageRef.current.click()}
                            />
                        </FormControl>

                        {imageUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imageUrl} alt="selected image" />
                                <CloseButton
                                    onClick={() => {
                                        setImageUrl(null);
                                    }}
                                    bg={"gray.800"}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleCreatePost} isLoading={loading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default CreatePost;
