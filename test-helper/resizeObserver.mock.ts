/* eslint-disable */
//TODO remove eslint disable
const makeResizeObserverMock = () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;
};

export default makeResizeObserverMock;
