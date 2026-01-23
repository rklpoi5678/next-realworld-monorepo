import AuthProvider from "@/providers/auth-provider";
import DialogProvider from "@/providers/modal-context";
import QueryProvider from "@/providers/query-provider";
import RouteGuard from "@/providers/route-guard";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <QueryProvider>
        <RouteGuard >
          <DialogProvider>
            {children}
          </DialogProvider>
        </RouteGuard>
      </QueryProvider>
    </AuthProvider>
  )
}