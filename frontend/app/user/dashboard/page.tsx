"use client";

import { API_URL } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import ContentWrapper from "../../components/ContentWrapper";
import PageHeader from "../../components/PageHeader";

import { Alert, IconButton, List, ListItem, Snackbar, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";

interface PostType {
  content: string;
  liked: boolean;
  likes: number;
  time: string;
};

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

  return (
    <ListItem alignItems="center" sx={{ display: "flex", flexDirection: "column", paddingBottom: "40px" }}>
      <PostMetadata>
        <ProfileImage>
          <PersonIcon sx={{ color: "#000000", scale: 1.5 }} />
        </ProfileImage>
        <Typography variant="body1">
          {post.time}
        </Typography>
      </PostMetadata>
      <PostContent>
        <Typography variant="body1" margin="20px">
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
      time: "1 February 2025",
      liked: false,
      likes: 1017,
      content: "This course provides an introduction to building secure software applications. It examines the software development life cycle and teaches what developers can do in each step to make their software more secure.  It also will cover common vulnerabilities that exist and how developers can avoid or safeguard against them. Students completing this course should be able to build and deploy software with fewer security issues. Intended audience: Fourth year CS students (CS 45X)"
    },
    {
      time: "3 hours ago",
      liked: false,
      likes: 5796,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    },
    {
      time: "5 hours ago",
      liked: false,
      likes: 0,
      content: "A button is a fastener that joins two pieces of fabric together by slipping through a loop or by sliding through a buttonhole. In modern clothing and fashion design, buttons are commonly made of plastic but also may be made of metal, wood, or seashell. Buttons can also be used on containers such as wallets and bags."
    }
  ];

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/readAll`);
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    } catch {
      setError(true);
      return { posts: temp_fallback_posts };
    }
  }
  
  const { data } = useQuery<{ posts: PostType[] }>({
    queryKey: ["user"],
    queryFn: fetchPosts,
  });

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <PageHeader hasPostButton={true} />
        <ContentWrapper>
          <List sx={{ overflowY: "auto", paddingTop: "3vh" }}>
            {data && data.posts ?
              data.posts.map((post: PostType, index: number) => (
                <Post key={index} post={post} />
              )) :
              <Typography variant="body1">
                Loading posts...
              </Typography>}
          </List>
          {data && data.posts && (
            <Typography variant="body1" marginBottom="40px">
              ~~That&#39;s all for now~~
            </Typography>)}
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
