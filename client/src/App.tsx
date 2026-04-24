import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AnalyticsLoader from "@/components/analytics-loader";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

const HireMe = lazy(() => import("@/pages/hire-me"));
const Consultation = lazy(() => import("@/pages/consultation"));
const Automati = lazy(() => import("@/pages/automati"));
const Bootcamp = lazy(() => import("@/pages/bootcamp"));
const Mentorship = lazy(() => import("@/pages/mentorship"));
const Admin = lazy(() => import("@/pages/admin"));

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" data-testid="route-loading">
      <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground animate-spin" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnalyticsLoader />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pt-0">
            <Suspense fallback={<RouteFallback />}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/hire-me" component={HireMe} />
                <Route path="/consultation" component={Consultation} />
                <Route path="/automati" component={Automati} />
                <Route path="/bootcampai" component={Bootcamp} />
                <Route path="/mentorship" component={Mentorship} />
                <Route path="/admin" component={Admin} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
