import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page py-24 flex flex-col items-center text-center gap-5">
      <h1 className="font-display text-5xl text-charcoal">404</h1>
      <p className="font-sans text-charcoal/60 max-w-md">We couldn't find that page. It may have moved or no longer exists.</p>
      <div className="flex gap-3">
        <Button href="/" variant="primary" size="lg">
          Go home
        </Button>
        <Button href="/shop" variant="ghost" size="lg">
          Shop the collection
        </Button>
      </div>
    </div>
  );
}
