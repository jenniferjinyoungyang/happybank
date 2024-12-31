import '@testing-library/jest-dom';
import * as nextRouterMock from 'next-router-mock';
import 'whatwg-fetch';
import makeResizeObserverMock from './test-helper/resizeObserver.mock';

makeResizeObserverMock();

jest.mock('next/navigation', () => ({
  ...nextRouterMock,
  usePathname: () => nextRouterMock.memoryRouter.pathname,
}));
