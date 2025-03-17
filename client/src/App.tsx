import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Wardrobe from "@/pages/Wardrobe";
import Outfits from "@/pages/Outfits";
import Recommendations from "@/pages/Recommendations";
import Sustainability from "@/pages/Sustainability";
import AuthPage from "@/pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Switch>
          <ProtectedRoute path="/" component={Wardrobe} />
          <ProtectedRoute path="/wardrobe" component={Wardrobe} />
          <ProtectedRoute path="/outfits" component={Outfits} />
          <ProtectedRoute path="/recommendations" component={Recommendations} />
          <ProtectedRoute path="/sustainability" component={Sustainability} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
