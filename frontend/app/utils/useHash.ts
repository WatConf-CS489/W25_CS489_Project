"use client";

// https://github.com/vercel/next.js/discussions/49465#discussioncomment-7968587

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const getHash = () =>
  typeof window !== "undefined" ? window.location.hash : null;

const useHash = () => {
  const [isClient, setIsClient] = useState(false);
  const [hash, setHash] = useState(getHash());
  const params = useParams();

  useEffect(() => {
    setIsClient(true);

    const updateHash = () => { setHash(getHash()); };
    updateHash();

    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [params]);

  return isClient ? hash : null;
};

export default useHash;
