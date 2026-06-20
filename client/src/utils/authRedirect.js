const isInternalPath = (path) =>
  typeof path === "string" && path.startsWith("/") && !path.startsWith("//");

export const getCustomerRedirect = (redirect) => {
  const safeRedirect = isInternalPath(redirect) ? redirect : "";

  if (
    safeRedirect &&
    !["/login", "/register", "/unauthorized"].includes(safeRedirect)
  ) {
    return safeRedirect;
  }

  return "/";
};

export const getCustomerDashboardPath = () => "/profile";

export const getRoleRedirect = (role, redirect) => {
  const safeRedirect = isInternalPath(redirect) ? redirect : "";

  if (role === "admin") {
    return safeRedirect.startsWith("/admin") ? safeRedirect : "/admin";
  }

  if (role === "waiter") {
    return safeRedirect.startsWith("/waiter") || safeRedirect.startsWith("/service")
      ? safeRedirect
      : "/service/orders";
  }

  if (role === "kitchen") {
    return safeRedirect.startsWith("/kitchen") ? safeRedirect : "/kitchen";
  }

  return getCustomerDashboardPath();
};
