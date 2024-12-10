import * as React from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  router.navigate({ to: "/$pageId", params: { pageId: "1" } });
}
