import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Calculator from "./pages/Calculator";
import Blog from "./pages/Blog";
import SuccessCases from "./pages/SuccessCases";
import Admin from "./pages/Admin";
import BusinessClass from "./pages/BusinessClass";
import FamilyClass from "./pages/FamilyClass";
import PRCard from "./pages/PRCard";
import Reconsideration from "./pages/Reconsideration";
import Temporary from "./pages/Temporary";
import Team from "./pages/Team";
import SkillWorker from "./pages/SkillWorker";
import Citizenship from "./pages/Citizenship";
import BCCalculator from "./pages/BCCalculator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/booking" component={Booking} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/blog" component={Blog} />
      <Route path="/success-cases" component={SuccessCases} />
      <Route path="/admin" component={Admin} />
      <Route path="/businessclass" component={BusinessClass} />
      <Route path="/familyclass" component={FamilyClass} />
      <Route path="/prcard" component={PRCard} />
      <Route path="/reconsideration" component={Reconsideration} />
      <Route path="/temporary" component={Temporary} />
      <Route path="/team" component={Team} />
      <Route path="/skillworker" component={SkillWorker} />
      <Route path="/citizenship" component={Citizenship} />
      <Route path="/bccalculator" component={BCCalculator} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
