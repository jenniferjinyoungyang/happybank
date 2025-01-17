import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received
   * as a prop on the `SessionProvider` React Context
   */

  interface User extends DefaultUser {
    exp: number;
    iat: number;
    jti: string;
  }
  interface Session {
    user: User;
  }
}
