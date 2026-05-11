export interface AdminUserLite {
  username: string;
}

function getEnvCredentials() {
  const username = (process.env.ADMIN_USERNAME || "admin").trim();
  const password = process.env.ADMIN_PASSWORD || "Mahmood@2025";
  return { username, password };
}

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<AdminUserLite | null> {
  const env = getEnvCredentials();
  if (username === env.username && password === env.password) {
    return { username };
  }
  return null;
}
