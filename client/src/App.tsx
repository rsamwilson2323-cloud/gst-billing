import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Customers from "@/pages/customers";
import Products from "@/pages/products";
import InvoiceGenerator from "@/pages/invoice-generator";
import InvoiceHistory from "@/pages/invoice-history";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { useLocalStorageSync } from "@/hooks/use-local-storage-sync";

function Router() {
  useLocalStorageSync();
  
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/customers" component={Customers} />
        <Route path="/products" component={Products} />
        <Route path="/invoice" component={InvoiceGenerator} />
        <Route path="/history" component={InvoiceHistory} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
