import { updateSession } from './api/auth/sign-in';

export async function middleware(request) {
  return await updateSession(request);
}