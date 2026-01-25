import { createId } from '../useSendChatMessage.utils';

describe('useSendChatMessage.utils', () => {
  describe('createId', () => {
    it('should return a string ID', () => {
      const id = createId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should return a unique ID each time', () => {
      const id1 = createId();
      const id2 = createId();

      expect(id1).not.toBe(id2);
    });

    it('should return a UUID when crypto.randomUUID is available', () => {
      // Check if crypto.randomUUID is available
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        const id = createId();
        // UUID format check (should be a valid UUID string)
        expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      }
    });

    it('should use fallback when crypto is undefined', () => {
      const originalCrypto = global.crypto;

      try {
        // @ts-ignore
        global.crypto = undefined;

        const id = createId();

        // Should be in format: timestamp-randomPart
        expect(id).toMatch(/^\d+-[0-9a-f]+$/);
      } finally {
        // Restore crypto
        global.crypto = originalCrypto;
      }
    });

    it('should use fallback format when crypto.randomUUID is not available', () => {
      // Temporarily hide crypto.randomUUID
      const originalCrypto = global.crypto;

      try {
        // Create a new crypto object without randomUUID
        const cryptoWithoutRandomUUID = Object.create(originalCrypto);
        delete (cryptoWithoutRandomUUID as Partial<Crypto>).randomUUID;

        Object.defineProperty(global, 'crypto', {
          value: cryptoWithoutRandomUUID,
          writable: true,
        });

        const id = createId();

        // Should be in format: timestamp-randomPart
        expect(id).toMatch(/^\d+-[0-9a-f]+$/);
      } finally {
        // Restore crypto
        Object.defineProperty(global, 'crypto', {
          value: originalCrypto,
          writable: true,
        });
      }
    });

    it('should return different fallback IDs when called multiple times without randomUUID', () => {
      // Temporarily hide crypto.randomUUID
      const originalCrypto = global.crypto;

      try {
        // Create a new crypto object without randomUUID
        const cryptoWithoutRandomUUID = Object.create(originalCrypto);
        delete (cryptoWithoutRandomUUID as Partial<Crypto>).randomUUID;

        Object.defineProperty(global, 'crypto', {
          value: cryptoWithoutRandomUUID,
          writable: true,
        });

        const id1 = createId();
        // Small delay to ensure different timestamp or random part
        const start = Date.now();
        while (Date.now() === start) {
          // Busy wait for timestamp to change
        }
        const id2 = createId();

        expect(id1).not.toBe(id2);
      } finally {
        // Restore crypto
        Object.defineProperty(global, 'crypto', {
          value: originalCrypto,
          writable: true,
        });
      }
    });
  });
});
