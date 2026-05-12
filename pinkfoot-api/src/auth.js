import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "local-dev-secret";

export function signAdminToken(email) {
  return jwt.sign({ sub: email, role: "admin" }, SECRET, { expiresIn: "30d" });
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
