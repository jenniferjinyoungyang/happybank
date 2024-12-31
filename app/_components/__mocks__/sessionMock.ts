import { Session, User } from 'next-auth';

const makeUserMock = (): User => ({
  id: 'testerid',
  email: 'barbietester@happybank.io',
  exp: 1738201018,
  iat: 1735609018,
  jti: 'some-random-string',
  name: 'Barbie Tester',
});

export const makeSessionMock = (): Session => ({
  expires: '2024-12-31T02:07:00.203Z',
  user: makeUserMock(),
});
