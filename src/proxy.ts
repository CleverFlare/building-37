import { chain } from "./proxies/chain";
import withAuth from "./proxies/with-auth";

export default chain([withAuth]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
