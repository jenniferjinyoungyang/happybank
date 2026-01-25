export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  readonly id: string;
  readonly role: ChatRole;
  readonly content: string;
};
