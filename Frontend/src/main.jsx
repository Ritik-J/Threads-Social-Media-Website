import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { extendTheme } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./Context/SocketContext.jsx";

const styles = {
  global: (props) => ({
    body: {
      color: props.colorMode === "dark" ? "whiteAlpha.900" : "gray.800",
      bg: props.colorMode === "dark" ? "#101010" : "gray.100",
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: "#6e6e6e",
    dark: "#1e1e1e",
  },
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById("root")).render(
  //in devlopment strictmode render evert component twice in production it will work fine
  <RecoilRoot>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </ChakraProvider>
    </BrowserRouter>
  </RecoilRoot>
);
