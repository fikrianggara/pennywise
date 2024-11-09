import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useNetworkChecker() {
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (window) {
      window.addEventListener("online", () => {
        toast.success("You are back online");
        setIsOnline(true);
        console.log("Became online");
      });
      window.addEventListener("offline", () => {
        toast.error("You are offline");
        setIsOnline(false);
        console.log("Became offline");
      });
    }
  });

  return { isOnline };
}
