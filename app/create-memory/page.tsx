'use client';

import { FC } from 'react';
import { PageContainer } from '../_shared/_components/PageContainer';
import { PageFooter } from '../_shared/_components/PageFooter';
import PageHeader from '../_shared/_components/PageHeader';
import { CreateMemoryPanel } from './_components/CreateMemoryPanel';

const CreateMemoryPage: FC = () => (
  <PageContainer>
    <section className="flex min-h-0 flex-1 flex-col">
      <PageHeader />
      <CreateMemoryPanel />
      <PageFooter />
    </section>
  </PageContainer>
);

export default CreateMemoryPage;
