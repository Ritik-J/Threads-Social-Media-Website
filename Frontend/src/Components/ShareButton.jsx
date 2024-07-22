import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Flex,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";

const ShareButton = () => {
  return (
    <Popover placement="top" closeOnBlur={false}>
      <PopoverTrigger>
        <svg
          aria-label="Share"
          color=""
          fill="rgb(243, 245, 247)"
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
        >
          <title>Share</title>
          <line
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="22"
            x2="9.218"
            y1="3"
            y2="10.083"
          ></line>
          <polygon
            fill="none"
            points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></polygon>
        </svg>
      </PopoverTrigger>
      <PopoverContent
        alignItems={"center"}
        width={"fit-content"}
        bg={useColorModeValue("whiteAlpha.900", "gray.dark")}
      >
        <PopoverArrow bg={useColorModeValue("gray.dark", "whiteAlpha.900")} />
        <PopoverBody>
          <Flex gap={2} wrap={"wrap"}>
            <Box
              w={["24px", "32px"]} // Responsive width for icons
              h={["24px", "32px"]} // Responsive height for icons
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FacebookShareButton url="https://facebook.com">
                <FacebookIcon size="100%" round />
              </FacebookShareButton>
            </Box>

            <Box
              w={["24px", "32px"]} // Responsive width for icons
              h={["24px", "32px"]} // Responsive height for icons
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TwitterShareButton url="https://x.com">
                <TwitterIcon size="100%" round />
              </TwitterShareButton>
            </Box>

            <Box
              w={["24px", "32px"]} // Responsive width for icons
              h={["24px", "32px"]} // Responsive height for icons
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LinkedinShareButton url="https://linkedin.com">
                <LinkedinIcon size="100%" round />
              </LinkedinShareButton>
            </Box>

            <Box
              w={["24px", "32px"]} // Responsive width for icons
              h={["24px", "32px"]} // Responsive height for icons
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TelegramShareButton url="https://telegram.com">
                <TelegramIcon size="100%" round />
              </TelegramShareButton>
            </Box>

            <Box
              w={["24px", "32px"]} // Responsive width for icons
              h={["24px", "32px"]} // Responsive height for icons
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <WhatsappShareButton url="https://whatsappweb.com">
                <WhatsappIcon size="100%" round />
              </WhatsappShareButton>
            </Box>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
