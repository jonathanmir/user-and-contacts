import { AuthProvider } from "./AuthContext";

interface iProviders {
  children: React.ReactNode;
}

export const Providers = ({ children }: iProviders) => {
  return <AuthProvider>{children}</AuthProvider>;
};
