const isInternalPath = (path) =>
  typeof path === "string" && path.startsWith("/") && !path.startsWith("//");

const isStaffArea = (path) =>
  path.startsWith("/admin") ||
  path.startsWith("/waiter") ||
  path.startsWith("/kitchen");

export const getCustomerRedirect = (redirect) => {
  if (!isInternalPath(redirect)) return "/menu";
  if (isStaffArea(redirect)) return "/menu";
  if (["/login", "/register", "/unauthorized"].includes(redirect)) {
    return "/menu";
  }

  return redirect || "/menu";
};

export const getRoleRedirect = (role, redirect) => {
  const safeRedirect = isInternalPath(redirect) ? redirect : "";

  if (role === "admin") {
    return safeRedirect.startsWith("/admin") ? safeRedirect : "/admin";
  }

  if (role === "waiter") {
    return safeRedirect.startsWith("/waiter")
      ? safeRedirect
      : "/waiter/orders";
  }

  if (role === "kitchen") {
    return safeRedirect.startsWith("/kitchen") ? safeRedirect : "/kitchen";
  }

  return getCustomerRedirect(safeRedirect || "/menu");
};
