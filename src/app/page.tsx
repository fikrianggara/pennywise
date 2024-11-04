"use client";
import { ModeToggle } from "@/components/toggle-button";
import { TypographyH2 } from "@/components/ui/typhography";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-11/12 mx-auto flex items-center justify-between">
      <TypographyH2>PennyWise</TypographyH2>
    </div>
  );
}
