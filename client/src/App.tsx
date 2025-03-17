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

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Wardrobe} />
          <Route path="/wardrobe" component={Wardrobe} />
          <Route path="/outfits" component={Outfits} />
          <Route path="/recommendations" component={Recommendations} />
          <Route path="/sustainability" component={Sustainability} />
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
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
