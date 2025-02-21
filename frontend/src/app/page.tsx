"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { API_URL } from "./constants";

const queryClient = new QueryClient()

export default function Page() {
  return <QueryClientProvider client={queryClient}>
    <Content />
  </QueryClientProvider>;
}

function Content() {
  const response = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/hello`);
      return response.text();
    }
  })
  return <h1>{response.data || "Loading..."}</h1>;
}
