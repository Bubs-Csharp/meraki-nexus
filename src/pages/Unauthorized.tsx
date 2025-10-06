import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <ShieldAlert className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground text-lg">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
