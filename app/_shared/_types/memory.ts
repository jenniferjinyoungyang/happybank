export type MemoryCreationFields = {
  readonly title: string;
  readonly message: string;
  readonly hashtags: string[];
  readonly imageId: string | null;
};

export type Memory = MemoryCreationFields & {
  readonly createdAt: Date;
};
