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
        // @ts-expect-error - intentionally removing crypto for test
        delete global.crypto;

        const id = createId();

        // Should be in format: timestamp-randomPart
        expect(id).toMatch(/^\d+-[0-9a-f]+$/);
      } finally {
        // Restore crypto
        global.crypto = originalCrypto;
      }
    });

    it('should use fallback format when crypto.randomUUID is not available', () => {
      const originalCrypto = global.crypto;

      try {
        // Use Proxy to hide randomUUID from 'in' operator check
        const cryptoWithoutRandomUUID = new Proxy(originalCrypto, {
          has(target, prop) {
            if (prop === 'randomUUID') return false;
            return prop in target;
          },
          get(target, prop) {
            if (prop === 'randomUUID') return undefined;
            return (target as any)[prop];
          },
        });

        Object.defineProperty(global, 'crypto', {
          value: cryptoWithoutRandomUUID,
          writable: true,
          configurable: true,
        });

        const id = createId();

        // Should be in format: timestamp-randomPart
        expect(id).toMatch(/^\d+-[0-9a-f]+$/);
      } finally {
        // Restore crypto
        Object.defineProperty(global, 'crypto', {
          value: originalCrypto,
          writable: true,
          configurable: true,
        });
      }
    });

    it('should return different fallback IDs when called multiple times without randomUUID', () => {
      const originalCrypto = global.crypto;

      try {
        // Use Proxy to hide randomUUID from 'in' operator check
        const cryptoWithoutRandomUUID = new Proxy(originalCrypto, {
          has(target, prop) {
            if (prop === 'randomUUID') return false;
            return prop in target;
          },
          get(target, prop) {
            if (prop === 'randomUUID') return undefined;
            return (target as any)[prop];
          },
        });

        Object.defineProperty(global, 'crypto', {
          value: cryptoWithoutRandomUUID,
          writable: true,
          configurable: true,
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
          configurable: true,
        });
      }
    });
  });
});
