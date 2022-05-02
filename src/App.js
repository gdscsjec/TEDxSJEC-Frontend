import React from "react";
import { Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import Ticket from "./pages/Ticket";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="*" element={<Registration />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
