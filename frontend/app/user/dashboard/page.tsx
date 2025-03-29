"use client";

import { API_URL } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import * as yup from "yup";
import moment from "moment";

import ContentWrapper from "@/components/ContentWrapper";
import PageHeader from "@/components/PageHeader";

import {
  Alert,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Snackbar,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";
import ArrowUpward from "@mui/icons-material/ArrowUpward"

const postSchema = yup.object({
  id: yup.string().required(),
  time: yup.number().required(),
  liked: yup.boolean().required(),
  likes: yup.number().required(),
  content: yup.string().required(),
});

const responseSchema = yup.object({
  posts: yup.array(postSchema).required(),
});

type PostType = yup.InferType<typeof postSchema>;

const Post = ({ post }: { post: PostType }) => {
  const ProfileImage = styled(IconButton)({
    color: "#000000",
    backgroundColor: "#d9d9d9",
    "&:hover": {
      backgroundColor: "#d9d9d9",
    },
    display: "inline-flex",
    width: "50px",
    height: "50px",
    marginRight: "15px",
    pointerEvents: "none",
  });

  const PostMetadata = styled(Box)({
    display: "flex",
    alignItems: "center",
    width: "60%",
    marginBottom: "20px",
  });

  const PostContent = styled(Box)({
    display: "flex",
    width: "60%",
    backgroundColor: "#ffffff",
    opacity: 0.9,
    borderRadius: "10px",
  });

  const queryClient = useQueryClient();

  const { mutate: toggleVoteMutation } = useMutation({
    mutationFn: async (post: PostType) => {
      const response = await fetch(`${API_URL}/toggle-vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  return (
    <ListItem
      alignItems="center"
      sx={{ display: "flex", flexDirection: "column", paddingBottom: "40px" }}
    >
      <PostMetadata>
        <ProfileImage>
          <PersonIcon sx={{ color: "#000000", scale: 1.5 }} />
        </ProfileImage>
        <Typography variant="body1">
          {moment.unix(post.time).fromNow()}
        </Typography>
        {/* Voting */}
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body1" sx={{ marginRight: "10px" }}>
          {post.likes} {post.likes === 1 ? "vote" : "votes"}
        </Typography>
        <IconButton
          sx={{
            color: "#000000",
            backgroundColor: "#d9d9d9",
            "&:hover": {
              backgroundColor: "#d9d9d9",
            },
          }}
          onClick={() => {
            toggleVoteMutation(post);
          }}
        >
          <ArrowUpward sx={{ color: post.liked ? "yellow" : "#000", scale: 1.5 }} />
        </IconButton>
      </PostMetadata>
      <PostContent>
        <Typography
          variant="body1"
          margin="20px"
          sx={{ wordBreak: "break-word" }}
        >
          {post.content}
        </Typography>
      </PostContent>
    </ListItem>
  );
};

export default function Page() {
  const [error, setError] = useState(false);

  const temp_fallback_posts: PostType[] = [
    {
      id: "1",
      time: 1740992164,
      liked: false,
      likes: 1017,
      content:
        "This course provides an introduction to building secure software applications. It examines the software development life cycle and teaches what developers can do in each step to make their software more secure.  It also will cover common vulnerabilities that exist and how developers can avoid or safeguard against them. Students completing this course should be able to build and deploy software with fewer security issues. Intended audience: Fourth year CS students (CS 45X)",
    },
    {
      id: "2",
      time: 1740819364,
      liked: false,
      likes: 5796,
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      id: "3",
      time: 1740974164,
      liked: false,
      likes: 0,
      content:
        "A button is a fastener that joins two pieces of fabric together by slipping through a loop or by sliding through a buttonhole. In modern clothing and fashion design, buttons are commonly made of plastic but also may be made of metal, wood, or seashell. Buttons can also be used on containers such as wallets and bags.",
    },
  ];

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/readAll`);
      if (!response.ok) {
        throw new Error();
      }
      return await responseSchema.validate(await response.json());
    } catch (e) {
      console.error(e);
      setError(true);
      return { posts: temp_fallback_posts };
    }
  };

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchPosts,
  });

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <PageHeader hasPostButton={true} />
        <ContentWrapper>
          <List sx={{ overflowY: "auto", paddingTop: "3vh", width: "100%" }}>
            {data && data.posts ? (
              data.posts.map((post, index) => <Post key={index} post={post} />)
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            )}
          </List>
          {data && data.posts && (
            <Typography variant="body1" marginBottom="40px">
              ~~That&#39;s all for now~~
            </Typography>
          )}
          <Snackbar
            open={error}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={3000}
            onClose={() => setError(false)}
          >
            <Alert
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
              onClose={() => setError(false)}
            >
              An error occurred.
            </Alert>
          </Snackbar>
        </ContentWrapper>
      </Box>
    </>
  );
}
