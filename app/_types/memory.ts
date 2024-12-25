export type Memory = {
  readonly title: string;
  readonly message: string;
  readonly createdAt: Date;
  readonly hashtag: string;
};

export type MemoryCreationFields = Omit<Memory, 'createdAt'>;