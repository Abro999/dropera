"use client";

import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page py-24 flex flex-col items-center text-center gap-5">
      <h1 className="font-display text-3xl text-charcoal">Something went wrong</h1>
      <p className="font-sans text-charcoal/60 max-w-md">
        That's on us, not you. Try again, or head back to the homepage.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="primary" size="lg">
          Try again
        </Button>
        <Button href="/" variant="ghost" size="lg">
          Go home
        </Button>
      </div>
    </div>
  );
}
