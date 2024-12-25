import { FC } from 'react';

export const MemoryImageCard: FC = () => (
  <div className="relative w-1/3 m-0 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl shrink-0 mr-12">
    <img
      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1471&amp;q=80"
      alt="card-image"
      className="object-cover w-full h-full"
    />
  </div>
);
