"use client";

import React from "react";
import {
  Breadcrumb as BreadcrumbShadcn,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { useGetBreadcrumbList } from "@/hooks/use-breadcrumb";

export const Breadcrumb = () => {
  const { pathList } = useGetBreadcrumbList();
  return (
    <BreadcrumbShadcn>
      <BreadcrumbList>
        {pathList.map((path, index) => (
          <div key={index} className="flex items-center gap-2">
            <BreadcrumbItem key={index} className="hidden md:block">
              <BreadcrumbLink href={path.href}>{path.title}</BreadcrumbLink>
            </BreadcrumbItem>
            {index !== pathList.length - 1 && pathList.length > 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </BreadcrumbShadcn>
  );
};
