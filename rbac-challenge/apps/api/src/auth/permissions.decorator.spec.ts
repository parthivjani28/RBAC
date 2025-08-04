import { PERMISSIONS_KEY, Permissions } from './permissions.decorator';


describe('Permissions Decorator', () => {
  it('should set metadata with permissions', () => {
    class TestClass {}
    Permissions('read', 'write')(TestClass);
    const permissions = Reflect.getMetadata(PERMISSIONS_KEY, TestClass);
    expect(permissions).toEqual(['read', 'write']);
  });
});
