const ROLE_HIERARCHY = ['viewer', 'admin', 'owner'] as const;
export type Role = typeof ROLE_HIERARCHY[number];

export function hasRole(userRole: string, requiredRole: string): boolean {
  const userIdx = ROLE_HIERARCHY.indexOf(userRole as Role);
  const requiredIdx = ROLE_HIERARCHY.indexOf(requiredRole as Role);
  return userIdx >= requiredIdx;
}

// In your permission check:
