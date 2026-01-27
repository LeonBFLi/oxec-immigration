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
import BlogEditor from "./pages/BlogEditor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/booking" component={Booking} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/blog" component={Blog} />
      <Route path="/success-cases" component={SuccessCases} />
      <Route path="/admin" component={Admin} />
      <Route path="/blog/editor" component={BlogEditor} />
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
