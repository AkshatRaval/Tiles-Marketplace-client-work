export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-black uppercase italic tracking-tight">
        Access Denied
      </h1>
      <p className="text-muted-foreground text-sm">
        You are not authorized to view this page.
      </p>
      <a href="/login" className="text-primary underline text-sm font-bold">
        Back to Login
      </a>
    </div>
  );
}