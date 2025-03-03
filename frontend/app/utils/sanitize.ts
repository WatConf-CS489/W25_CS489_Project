"use client";

import DOMPurify from "dompurify";

const sanitize = (text: string | null) => {
  if (!text) {
    return null;
  }
  return DOMPurify.sanitize(text);
};

export default sanitize;
