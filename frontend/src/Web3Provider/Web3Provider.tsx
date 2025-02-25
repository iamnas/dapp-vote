import { WagmiProvider, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import  { ReactNode } from "react";

const config = createConfig(
  getDefaultConfig({
    chains: [sepolia],
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    appName: "Vote",
    appDescription: "Vote App",
    appUrl: "https://family.co", 
    appIcon: "https://family.co/logo.png", 
  }),
);

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};