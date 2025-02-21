"use client";

import { useQuery } from "@tanstack/react-query";
import { API_URL } from "./constants";

export default function Page() {
  const response = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/hello`);
      return response.text();
    }
  })
  return <h1>{response.data || "Loading..."}</h1>;
}
