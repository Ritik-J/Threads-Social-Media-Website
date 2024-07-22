//library
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//files
import useShowToast from "../Hooks/useShowToast";
import UserHeader from "../Components/UserHeader";
import Posts from "../Components/Posts";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import useGetUserProfile from "../Hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../Atoms/PostsAtom";

function UserPage() {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();
  useEffect(() => {
    const getposts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();

        // Check if data is an array
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getposts();
  }, [username]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && loading) return <h1>User not found</h1>;
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          User has no post
        </Box>
      )}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Posts key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
}

export default UserPage;
