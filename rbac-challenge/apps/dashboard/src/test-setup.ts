declare global {
  // eslint-disable-next-line no-var
  var ngJest: any;
}
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
import 'jest-preset-angular/setup-jest';
