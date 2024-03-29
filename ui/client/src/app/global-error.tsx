"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="h-screen">
        <h2>Something went wrong!</h2>
        <p>
          <code>{error.message}</code>
        </p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
