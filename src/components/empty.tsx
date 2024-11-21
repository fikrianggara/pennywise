import React from "react";
import { PackageOpenIcon } from "lucide-react";
const Empty = () => {
  return (
    <div className="h-[20rem] flex justify-center items-center text-2xl m-auto text-base">
      <div className="flex flex-col gap-4 items-center text-foreground">
        <PackageOpenIcon size={48} />
        tidak ada data
      </div>
    </div>
  );
};

export default Empty;
