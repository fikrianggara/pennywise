"use client";
import { TypographyH2 } from "@/components/ui/typhography";
import { useNetworkChecker } from "@/hooks/use-networkchecker";

export default function Home() {
  const { isOnline } = useNetworkChecker();
  console.log(isOnline);
  return (
    <div className="w-11/12 mx-auto flex items-center justify-between">
      <TypographyH2>PennyWise</TypographyH2>
    </div>
  );
}
