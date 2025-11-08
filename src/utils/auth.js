export function decodeJWT(tk) {
  try {
    if (!tk) return null;
    const base64 = tk.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}