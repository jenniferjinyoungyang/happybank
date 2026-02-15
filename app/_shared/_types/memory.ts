export type Memory = {
  readonly title: string;
  readonly message: string;
  readonly createdAt: Date;
  readonly hashtagRelations?: ReadonlyArray<{
    readonly hashtag: {
      readonly id: number;
      readonly name: string;
      readonly createdAt: Date;
    };
  }>;
  readonly imageId: string | null;
};

export type MemoryCreationFields = Omit<Memory, 'createdAt' | 'hashtagRelations'>;
