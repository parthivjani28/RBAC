const ROLE_HIERARCHY = ['viewer', 'admin', 'owner'] as const;
export type Role = typeof ROLE_HIERARCHY[number];

export function hasRole(userRole: string, requiredRole: string): boolean {
  // Always compare lowercase
  const userIdx = ROLE_HIERARCHY.indexOf((userRole || '').toLowerCase() as Role);
  const requiredIdx = ROLE_HIERARCHY.indexOf((requiredRole || '').toLowerCase() as Role);
  return userIdx >= 0 && requiredIdx >= 0 && userIdx >= requiredIdx;
}

// In your permission check:
