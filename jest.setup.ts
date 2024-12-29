import '@testing-library/jest-dom';
import * as nextRouterMock from 'next-router-mock';
import 'whatwg-fetch';
import makeResizeObserverMock from './test-helper/resizeObserverMock';

makeResizeObserverMock();

jest.mock('next/navigation', () => nextRouterMock);
