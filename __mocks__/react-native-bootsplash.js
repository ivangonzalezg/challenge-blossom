module.exports = {
  hide: jest.fn(() => Promise.resolve()),
  isVisible: jest.fn(() => Promise.resolve(false)),
  useHideAnimation: jest.fn(),
};
