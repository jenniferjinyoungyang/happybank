import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;

if (typeof Response.json !== 'function') {
  Response.json = (data: unknown, init?: ResponseInit) => {
    const response = new Response(JSON.stringify(data), init);
    Object.defineProperty(response, 'json', {
      value: async () => data,
      writable: true,
      configurable: true,
    });
    return response;
  };
}
import makeResizeObserverMock from './test-helper/resizeObserver.mock';

makeResizeObserverMock();

if (typeof HTMLFormElement !== 'undefined') {
  Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    configurable: true,
    writable: true,
    value: function (this: HTMLFormElement, submitter?: HTMLElement | null) {
      if (submitter && this.contains(submitter)) {
        (submitter as HTMLElement).click();
        return true;
      }

      const event = new Event('submit', { bubbles: true, cancelable: true });
      return this.dispatchEvent(event);
    },
  });
}

const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  // jsdom currently logs an unimplemented requestSubmit warning when
  // user-event clicks a button inside a form. We intentionally ignore
  // that noise in tests because the app handles submit behavior safely.
  const shouldIgnore = args.some((arg) => {
    if (typeof arg === 'string') {
      return arg.includes('Not implemented: HTMLFormElement.prototype.requestSubmit');
    }

    if (arg instanceof Error) {
      return arg.message.includes('Not implemented: HTMLFormElement.prototype.requestSubmit');
    }

    if (typeof arg === 'object' && arg !== null) {
      const errorLike = arg as { message?: unknown };
      return (
        typeof errorLike.message === 'string' &&
        errorLike.message.includes('Not implemented: HTMLFormElement.prototype.requestSubmit')
      );
    }

    return false;
  });

  if (shouldIgnore) {
    return;
  }

  originalConsoleError(...args);
};

jest.mock('next/navigation', () => {
  const routerMock = jest.requireActual('next-router-mock');
  return {
    ...routerMock,
    usePathname: () => routerMock.memoryRouter.pathname,
    useSearchParams: () => new URLSearchParams(routerMock.memoryRouter.asPath.split('?')[1] || ''),
  };
});
