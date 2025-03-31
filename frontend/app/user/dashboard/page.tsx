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
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FlagIcon from "@mui/icons-material/Flag";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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

// Router as prop is bad practice but I get next issues otherwise so it is what it is
const Post = ({
  post,
  router,
}: {
  post: PostType;
  router: AppRouterInstance;
}) => {
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
    flexDirection: "column",
    width: "60%",
    backgroundColor: "#ffffff",
    opacity: 0.9,
    borderRadius: "10px",
  });

  const PostActions = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    opacity: 0.9,
    marginLeft: "20px",
    marginRight: "20px",
    marginBottom: "20px",
  });

  const VotesBox = styled(Box)({
    display: "flex",
    flex: "none",
    backgroundColor: "#787878",
    alignItems: "center",
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
      </PostMetadata>
      <PostContent>
        <Typography
          variant="body1"
          margin="20px"
          sx={{ wordBreak: "break-word" }}
        >
          {post.content}
        </Typography>
        <PostActions>
          <VotesBox>
            <Tooltip title="Like" arrow>
              <IconButton
                onClick={() => {
                  toggleVoteMutation(post);
                }}
              >
                <FavoriteIcon
                  sx={{ color: post.liked ? "#fed34c" : "#ffffff" }}
                />
              </IconButton>
            </Tooltip>
            <Typography
              variant="body1"
              sx={{ marginRight: "10px", color: "#ffffff" }}
            >
              {post.likes}
            </Typography>
          </VotesBox>
          <Tooltip title="Report" arrow>
            <IconButton
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem(
                    "reportDetails",
                    JSON.stringify({
                      content: post.content,
                      time: post.time,
                      id: post.id,
                    })
                  );
                }
                router.push("/user/report");
              }}
            >
              <FlagIcon sx={{ color: "#ff0000" }} />
            </IconButton>
          </Tooltip>
        </PostActions>
      </PostContent>
    </ListItem>
  );
};

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState(0);
  const [filterDate, setFilterDate] = useState(0);

  const handleSortByChange = (event: SelectChangeEvent<number>) => {
    setSortBy(Number(event.target.value));
  };

  const handleFilterDateChange = (event: SelectChangeEvent<number>) => {
    setFilterDate(Number(event.target.value));
  };

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

  const SortBox = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "20px",
  });

  const RoundedBox = styled(Box)({
    borderRadius: "10px",
    margin: "10px",
  });

  const filterAndSortPosts = (posts: PostType[]): PostType[] => {
    // How many hours back can posts go while staying in filtering window?
    const hoursMap: { [key: number]: number } = { 1: 24, 2: 168, 3: 720 };
    const hoursWindow = hoursMap[filterDate];

    if (hoursWindow) {
      const cutoff = moment().subtract(hoursWindow, "hours");
      posts = posts.filter((post) => moment.unix(post.time).isAfter(cutoff));
    }

    // Sort and return posts
    return posts.sort((a, b) => {
      if (sortBy === 0) {
        // Latest first
        return b.time - a.time;
      } else {
        // Most likes first
        return b.likes - a.likes;
      }
    });
  };

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <PageHeader hasPostButton={true} />
        <ContentWrapper>
          <SortBox>
            <RoundedBox>
              <FormControl variant="filled">
                <InputLabel id="sort-by-select-label">Sort by</InputLabel>
                <Select
                  labelId="sort-by-select-label"
                  value={sortBy}
                  onChange={handleSortByChange}
                >
                  <MenuItem value={0}>New</MenuItem>
                  <MenuItem value={1}>Top</MenuItem>
                </Select>
              </FormControl>
            </RoundedBox>
            <RoundedBox>
              <FormControl variant="filled">
                <InputLabel id="filter-date-select-label">
                  Date range
                </InputLabel>
                <Select
                  labelId="filter-date-select-label"
                  value={filterDate}
                  onChange={handleFilterDateChange}
                >
                  <MenuItem value={0}>All time</MenuItem>
                  <MenuItem value={1}>Today</MenuItem>
                  <MenuItem value={2}>Last week</MenuItem>
                  <MenuItem value={3}>Last month</MenuItem>
                </Select>
              </FormControl>
            </RoundedBox>
          </SortBox>
          <List sx={{ overflowY: "auto", paddingTop: "3vh", width: "100%" }}>
            {data && data.posts ? (
              filterAndSortPosts(data.posts).map((post, index) => (
                <Post key={index} post={post} router={router} />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
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
