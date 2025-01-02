'use client';

import { FC } from 'react';
import PageHeader from '../_shared/_components/PageHeader';
import { CreateMemoryPanel } from './_components/CreateMemoryPanel';
import { PageFooter } from '../_shared/_components/PageFooter';

const CreateMemoryPage: FC = () => (
  <section className="flex flex-col h-screen">
    <PageHeader />
    <CreateMemoryPanel />
    <PageFooter />
  </section>
);

export default CreateMemoryPage;
