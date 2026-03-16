/**
 * Checks if the current path is a public route, admin route, or dynamic path
 * @param {string} pathname - The current pathname from window.location.pathname
 * @returns {Object} An object containing isPublicRoute, isAdminRoute, and isDynamicPath booleans
 */
export const checkRouteType = (pathname) => {
  // Remove leading/trailing slashes and split into segments
  const pathSegments = pathname.replace(/^\/+|\/+$/g, '').split('/');

  // Check if it's a subdomain (not allowed)
  const hasSubdomain = window.location.hostname.split('.').length > 2;
  if (hasSubdomain) {
    return {
      isPublicRoute: false,
      isAdminRoute: false,
      isDynamicPath: true,
      publicRoutes,
    };
  }

  // List of all public routes (excluding dynamic parameters)
  const publicRoutes = [
    '', // root path
    'government/elected_officials',
    'government/elected_officials/governor/view',
    'government/elected_officials/deputy_governor/view',
    'government/elected_officials/ssg/view',
    'government/elected_officials/hos/view',
    'government/elected_officials/cos/view',
    'government/elected_officials/dcos/view',
    'government/judiciary_officials',
    'government/legistlative_officials',
    'services',
    'resources',
    'search',
    'connect',
    'privacy',
    'news',
    'events',
    'government',
  ];

  // Check if the path is an admin route (/:mda/admin)
  const isAdminRoute = pathSegments[1] === 'admin' || pathSegments.includes('admin');

  // Check if the path matches any public route exactly
  const isPublicRoute = publicRoutes.some((route) => {
    // For the root path
    if (route === '' && pathSegments.length === 0) return true;

    // For exact route matches (like /news, /services, etc.) - handle additional segments
    if (route === pathSegments[0]) return true;

    // For nested routes (like /government/elected_officials/governor/view)
    const routeSegments = route.split('/');
    if (routeSegments.length !== pathSegments.length) return false;

    return routeSegments.every((segment, i) => segment === pathSegments[i]);
  });

  // Check if the path matches the dynamic pattern (not admin and not public)
  const isDynamicPath =
    !isPublicRoute && !isAdminRoute && pathSegments.length >= 1 && pathSegments.length <= 3;

  return {
    isPublicRoute,
    isAdminRoute,
    isDynamicPath,
    publicRoutes,
  };
};

// Helper function to use with React Router's useLocation
// Example usage in a component:
// const { isPublicRoute, isAdminRoute, isDynamicPath } = useRouteType();
export const useRouteType = () => {
  const { pathname } = window.location;
  return checkRouteType(pathname);
};
