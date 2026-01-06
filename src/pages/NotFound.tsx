import { useNavigate } from "react-router-dom";
import { getCopyrightLine } from "@/lib/copyright";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-2">Something went wrong</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Please try again.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="h-10 px-6 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back
          </button>
        </div>
      </main>
      <footer className="py-6 text-center">
        <p className="text-xs text-muted-foreground">
          {getCopyrightLine()}
        </p>
      </footer>
    </div>
  );
}
