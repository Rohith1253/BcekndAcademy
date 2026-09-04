"use client";

import React, { use } from "react";
import MultiLanguagePlaygroundPage from "../page";

export default function DynamicPlaygroundLanguagePage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const resolved = use(params);
  return <MultiLanguagePlaygroundPage />;
}
