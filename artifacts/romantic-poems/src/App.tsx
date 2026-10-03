import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PoemDetail from "@/pages/poem-detail";
import AddPoem from "@/pages/add-poem";
import EditPoem from "@/pages/edit-poem";
import AdminPage, { AdminGuard } from "@/pages/admin";
import { Layout } from "@/components/layout";
import { LanguageProvider } from "@/contexts/language-context";
import { AdminAuthProvider } from "@/contexts/admin-auth-context";

const queryClient = new QueryClient();

function ProtectedAddPoem() {
  return (
    <AdminGuard>
      <AddPoem />
    </AdminGuard>
  );
}

function ProtectedEditPoem() {
  return (
    <AdminGuard>
      <EditPoem />
    </AdminGuard>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/poem/:id" component={PoemDetail} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/add-poem" component={ProtectedAddPoem} />
        <Route path="/edit-poem/:id" component={ProtectedEditPoem} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AdminAuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </AdminAuthProvider>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
