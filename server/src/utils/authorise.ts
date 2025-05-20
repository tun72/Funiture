// authorise(true, user.role, "AUTHOR", "ADMIN")
export const authorise = (
  permission: boolean,
  userRole: string,
  ...roles: string[]
) => {
  const result = roles.includes(userRole);

  let grant = true;

  if (permission && !result) {
    grant = false;
  }

  if (!permission && result) {
    grant = false;
  }

  return grant;
};
