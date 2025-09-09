import { chain } from "./middlewares/chain";
import withAuth from "./middlewares/with-auth";

export default chain([withAuth]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
