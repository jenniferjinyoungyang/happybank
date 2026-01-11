/**
 * Mock factory for next/server module to enable testing of Next.js API routes in Jest.
 *
 * This mock provides a working implementation of NextResponse.json() that
 * can be used in test environments where the Web API Response might not
 * be fully available.
 *
 * Usage:
 * ```typescript
 * import makeNextServerMock from './test-helper/nextServer.mock';
 *
 * jest.mock('next/server', () => makeNextServerMock());
 * ```
 */
const makeNextServerMock = () => {
  const actual = jest.requireActual<typeof import('next/server')>('next/server');
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      json: jest.fn(
        (body: unknown, init?: { status?: number; headers?: Record<string, string> }) => {
          const response = {
            json: async () => body,
            status: init?.status || 200,
            statusText: init?.status === 200 ? 'OK' : 'Error',
            ok: (init?.status || 200) < 400,
            headers: new Headers(init?.headers || {}),
          };
          return response;
        },
      ),
    },
  };
};

export default makeNextServerMock;
