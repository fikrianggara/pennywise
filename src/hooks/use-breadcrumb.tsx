"use client";
import { camalize } from "@/lib/utils";
import { usePathname } from "next/navigation";
import path from "path";
import { useEffect, useState } from "react";

export const useGetBreadcrumbList = () => {
  const pathname = usePathname();
  const [pathList, setPathList] = useState<{ title: string; href: string }[]>(
    []
  );
  useEffect(() => {
    if (pathname === "" || pathname === "/") {
      setPathList([{ title: "Beranda", href: "/" }]);
      return;
    } else {
      const pathArray = pathname.split("/");
      setPathList(
        pathArray.map((path, index) => {
          if (index == 0) {
            return {
              title: "Beranda",
              href: "/",
            };
          } else
            return {
              title: index == 0 ? "Beranda" : camalize(path.replace("-", " ")),
              href:
                index == 0 ? "/" : `${pathArray.slice(0, index + 1).join("/")}`,
            };
        })
      );
    }
  }, [pathname]);

  return { pathList };
};
