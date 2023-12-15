async function login() {
  return {
    success: true,
  };
}

async function register({
  username,
  password,
  email,
  role,
  organization,
  address,
}: {
  username: string;
  password: string;
  email: string;
  role: string;
  organization: string;
  address: string;
}) {}

async function logout() {}

export { register, login, logout };
