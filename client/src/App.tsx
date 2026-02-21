import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HireMe from "@/pages/hire-me";
import Bootcamp from "@/pages/bootcamp";
import Mentorship from "@/pages/mentorship";
import NotFound from "@/pages/not-found";

function App() {
  const [hireMode, setHireMode] = useState<"hire" | "consult">("hire");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header hireMode={hireMode} onHireModeChange={setHireMode} />
          <main className="flex-1 pt-0">
            <Switch>
              <Route path="/">
                <HireMe viewMode={hireMode} />
              </Route>
              <Route path="/bootcamp" component={Bootcamp} />
              <Route path="/mentorship" component={Mentorship} />
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
