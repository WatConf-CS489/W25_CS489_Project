"use client";

import { API_URL } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  async function logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
    });
    if (response.ok) {
      router.push("/");
    }
  }

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch(`${API_URL}/profile`).then((res) => res.json()),
  });

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div>Profiles</div>
      <div>{data?.message ?? "Loading message..."}</div>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
