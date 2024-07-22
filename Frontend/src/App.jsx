//library
import { Box, Container } from "@chakra-ui/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

//files
import UserPage from "./Pages/UserPage";
import PostPage from "./Pages/PostPage";
import Header from "./Components/Header";
import { HomePage } from "./Pages/Homepage";
import { AuthPages } from "./Pages/AuthPages";
import userAtom from "./Atoms/userAtom";

import UserProfile from "./Pages/UpdateProfilePage";
import CreatePost from "./Components/CreatePost";
import ChatPage from "./Components/chat/ChatPage";
import { SettingsPage } from "./Pages/SettingsPage";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW={pathname === "/" ? "900px" : "620px"}>
        <Header />
        <Routes>
          <Route
            path="/auth"
            element={!user ? <AuthPages /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/update"
            element={user ? <UserProfile /> : <Navigate to="/auth" />}
          />
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to="/auth" />}
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
