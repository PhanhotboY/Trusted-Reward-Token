"use client";

export default function ErrorHandler({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="h-screen">
      <h2>Some thing went wrong!</h2>
      <code>{error.message}</code>
      <p>{error.digest}</p>
    </div>
  );
}
