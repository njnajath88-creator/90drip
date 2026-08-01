export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("90drip_user");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export function requireAuth(onAuthenticatedCallback) {
  const user = getCurrentUser();
  if (!user) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("90drip_open_auth_modal"));
    }
    return false;
  }
  if (onAuthenticatedCallback) {
    onAuthenticatedCallback(user);
  }
  return true;
}
