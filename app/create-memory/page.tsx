'use client';

import { FC } from 'react';
import PageHeader from '../_shared/_components/PageHeader';
import { CreateMemoryPanel } from './_components/CreateMemoryPanel';

const CreateMemoryPage: FC = () => (
  <section className="flex flex-col h-screen">
    <PageHeader />
    <CreateMemoryPanel />
  </section>
);

export default CreateMemoryPage;
