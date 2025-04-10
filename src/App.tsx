
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import StudentProfile from "./pages/StudentProfile";
import OrganizerProfile from "./pages/OrganizerProfile";
import EditableProfile from "./pages/EditableProfile";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CalendarView from "./pages/CalendarView";
import EPassPage from "./pages/EPassPage";
import EPassesPage from "./pages/EPassesPage";
import EventFeedback from "./pages/EventFeedback";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/:type" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Student Routes */}
          <Route path="/student/profile" element={<EditableProfile />} />
          <Route path="/student/events" element={<EventsPage />} />
          <Route path="/student/calendar" element={<CalendarView />} />
          <Route path="/student/notifications" element={<Notifications />} />
          <Route path="/student/epasses" element={<EPassesPage />} />
          
          {/* Organizer Routes */}
          <Route path="/organizer/profile" element={<EditableProfile />} />
          <Route path="/organizer/events" element={<EventsPage />} />
          <Route path="/organizer/calendar" element={<CalendarView />} />
          <Route path="/organizer/notifications" element={<Notifications />} />
          
          {/* Event Routes */}
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/event/:id/feedback" element={<EventFeedback />} />
          <Route path="/epass/:id" element={<EPassPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
