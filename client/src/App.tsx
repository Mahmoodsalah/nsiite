import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HireMe from "@/pages/hire-me";
import Consultation from "@/pages/consultation";
import Bootcamp from "@/pages/bootcamp";
import Mentorship from "@/pages/mentorship";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pt-0">
            <Switch>
              <Route path="/" component={HireMe} />
              <Route path="/consultation" component={Consultation} />
              <Route path="/bootcampai" component={Bootcamp} />
              <Route path="/mentorship" component={Mentorship} />
              <Route path="/admin" component={Admin} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
