import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Link,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import {useRecoilState} from "recoil";
import userAtom from "../Atoms/userAtom";
import {useState} from "react";
import useShowToast from "../Hooks/useShowToast";

export default function Login({toggle}) {
    const [user, setUser] = useRecoilState(userAtom);
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const showToast = useShowToast();

    const handleLogin = async () => {
        console.log(inputs);
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();

            if (data.error) {
                // Ensure data.error is a string or convert it to a string
                const errorMessage = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
                showToast("Error", errorMessage, "error");
                return;
            }

            localStorage.setItem("user-info", JSON.stringify(data));
            setUser(data);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    return (
        <Flex align={"center"} justify={"center"}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"2xl"}>Sign in to your account</Heading>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("whiteSmoke", "gray.dark")}
                    boxShadow={"lg"}
                    p={8}
                    w={{base: "full", sm: "400px"}}
                >
                    <Stack spacing={4}>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="text"
                                onChange={(e) => setInputs({...inputs, username: e.target.value})}
                                value={inputs.username}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                onChange={(e) => setInputs({...inputs, password: e.target.value})}
                                value={inputs.password}
                            />
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack direction={{base: "column", sm: "row"}} align={"start"} justify={"space-between"}>
                                <Text align={"center"}>
                                    Already a user?{" "}
                                    <Link color={"blue.400"} onClick={toggle}>
                                        Signup
                                    </Link>
                                </Text>
                            </Stack>
                            <Button
                                onClick={handleLogin}
                                bg={"blue.400"}
                                color={"white"}
                                _hover={{
                                    bg: "blue.500",
                                }}
                            >
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
