import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <div className="min-h-svh bg-muted">
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-background">
        <Outlet />
      </div>
    </div>
  );
};
