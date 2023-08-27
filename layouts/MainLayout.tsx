import React, { PropsWithChildren } from "react";

export function MainLayout({ children }: PropsWithChildren) {
  return <div className=" px-3 md:px-40 py-10">{children}</div>;
}
