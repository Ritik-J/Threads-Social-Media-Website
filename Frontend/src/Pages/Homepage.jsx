import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

//files
import useShowToast from "../Hooks/useShowToast";
import Posts from "../Components/Posts";
import { useRecoilState } from "recoil";
import postsAtom from "../Atoms/PostsAtom";
import SuggestedUsers from "../Components/SuggestedUsers";

export const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed"); //it's a GET request so we don't have to pass anything extra
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [setPosts]);
  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <h1>Follow some user to see their post on your feed</h1>
        )}

        {loading && (
          <Flex justify={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}

        {posts.map((post) => (
          <Posts key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
      <Box flex={30}>
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};
