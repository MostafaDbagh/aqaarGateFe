"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query"; 
import ReduxProvider from "@/store/ReduxProvider";
import { GlobalModalProvider } from "@/components/contexts/GlobalModalContext";
import { FavoritesProvider } from "@/components/contexts/FavoritesContext";

export default function Providers({ children }) {
  return (
    <ReduxProvider>
      <GlobalModalProvider>
        <FavoritesProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </FavoritesProvider>
      </GlobalModalProvider>
    </ReduxProvider>
  );
}

