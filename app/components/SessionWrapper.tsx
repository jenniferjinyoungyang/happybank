'use client';

import { SessionProvider } from 'next-auth/react';

import React from 'react';

const SessionWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>{children}</SessionProvider>
);

export default SessionWrapper;
