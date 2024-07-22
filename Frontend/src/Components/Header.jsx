import {
  Flex,
  Image,
  useColorMode,
  Link,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import { IoIosHome } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { AiFillWechat } from "react-icons/ai";
import { MdOutlineSettings } from "react-icons/md";

//files
import userAtom from "../Atoms/userAtom";
import useLogout from "../Hooks/useLogout";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const Logout = useLogout();

  return (
    <Flex justifyContent={user ? "space-between" : "center"} mt={6} mb="12">
      {user && (
        <Link as={RouterLink} to={"/"}>
          <IoIosHome color={useColorModeValue("#1e1e1e", "white")} size={20} />
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/lightLogo.svg" : "/darkLogo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={"center"} gap={5}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <FaUserCircle
              color={useColorModeValue("#1e1e1e", "white")}
              size={20}
            />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <AiFillWechat
              color={useColorModeValue("#1e1e1e", "white")}
              size={25}
            />
          </Link>
          <Link as={RouterLink} to={`/settings`}>
            <MdOutlineSettings size={20} />
          </Link>
          <Button size={"xs"} onClick={Logout}>
            LogOut
          </Button>
        </Flex>
      )}
    </Flex>
  );
}

export default Header;
