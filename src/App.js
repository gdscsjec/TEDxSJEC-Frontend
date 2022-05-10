import React from "react";
import { Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import Ticket from "./pages/Ticket";
import { QueryClientProvider, QueryClient } from "react-query";
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="*" element={<Registration />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
