const ADMIN_CODE = 'TURMAVOLEI2024';
const ADMIN_SESSION_KEY = 'turma-volei-admin-session';

export const validateAdminCode = (code: string): boolean => {
  return code === ADMIN_CODE;
};

export const setAdminSession = () => {
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};

export const isAdminAuthenticated = (): boolean => {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};
