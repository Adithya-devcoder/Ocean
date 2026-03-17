import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Dashboard from "@/pages/Dashboard";
import CoralReefs from "@/pages/CoralReefs";
import Biodiversity from "@/pages/Biodiversity";
import Pollution from "@/pages/Pollution";
import ClimateImpact from "@/pages/ClimateImpact";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/coral-reefs" element={<CoralReefs />} />
            <Route path="/biodiversity" element={<Biodiversity />} />
            <Route path="/pollution" element={<Pollution />} />
            <Route path="/climate-impact" element={<ClimateImpact />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
