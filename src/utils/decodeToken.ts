export function getUserIdFromToken(): number | null {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));

    console.log("PAYLOAD JWT:", payload); // 🔥 DEBUG

    const id = payload.nameid;

    if (!id) return null;

    return Number(id);
  } catch (err) {
    console.error("Erro decode token:", err);
    return null;
  }
}