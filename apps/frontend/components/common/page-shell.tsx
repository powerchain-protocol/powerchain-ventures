import { Header } from "../header";
import { Footer } from "../footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}
