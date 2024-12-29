/* eslint-disable */
//TODO remove eslint disable
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import makeResizeObserverMock from './test-helper/resizeObserverMock';

makeResizeObserverMock();

jest.mock('next/navigation', () => require('next-router-mock'));
