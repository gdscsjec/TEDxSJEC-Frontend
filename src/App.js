import React from "react";
import { Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import Ticket from "./pages/Ticket";
import { QueryClientProvider, QueryClient } from "react-query";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Down from "./pages/Down";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Down />} />
        <Route
          path="/63c83774-3009-49e2-a6e9-87b8ca9c3ffa/live"
          element={<Registration />}
        />
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
