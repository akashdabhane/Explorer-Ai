import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/notebooks/:path*',
    '/api/documents/:path*',
    '/api/chat/:path*',
  ],
};
