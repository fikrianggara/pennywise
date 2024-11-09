import React from "react";
import { Alert as AlertShadcn, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";

export const Alert = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <AlertShadcn>
      <Terminal className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </AlertShadcn>
  );
};

export default Alert;
