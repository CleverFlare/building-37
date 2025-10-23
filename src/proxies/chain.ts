import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export type CustomMiddleware = (
  request: NextRequest,
  response: NextResponse,
) => Promise<NextResponse> | NextResponse;

type MiddlewareFactory = (proxy: CustomMiddleware) => CustomMiddleware;

export function chain(
  middlewares: MiddlewareFactory[],
  index = 0,
): CustomMiddleware {
  const current = middlewares[index];

  if (current) {
    const next = chain(middlewares, index + 1);
    return current(next);
  }

  // Last in chain → continue request
  return (request: NextRequest) => {
    return NextResponse.next();
  };
}
