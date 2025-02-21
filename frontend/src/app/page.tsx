"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

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
      const response = await fetch("http://localhost:8000/");
      return response.text();
    }
  })
  return <h1>{response.data || "Loading..."}</h1>;
}
