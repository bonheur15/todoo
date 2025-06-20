import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials"; // Import Credentials
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { randomUUID } from "crypto"; // For generating unique IDs

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google,
    Credentials({
      name: "Anonymous",
      credentials: {
        // We don't need actual credentials for anonymous login,
        // but the structure might be expected by NextAuth.
        // An empty object or a dummy field can be used.
        anonymous: {
          label: "Anonymous Login",
          type: "hidden",
          defaultValue: "true",
        },
      },
      async authorize(credentials) {
        console.log("Anonymous login attempt with credentials:", credentials);
        // The DrizzleAdapter's createUser method will be used implicitly
        // when a new user signs in if it doesn't exist.
        // We need to return a user object that the adapter can use.
        // NextAuth typically expects an existing user to be found or null.
        // However, for an "anonymous" credential, we are effectively always "creating" a new identity.
        // The adapter should handle the actual user creation if it receives user data here.

        const uuid = randomUUID();
        const uniqueEmail = `anon-${uuid}@example.com`;

        // We construct a user object. If an adapter is used,
        // NextAuth.js may not call adapter.createUser directly from here.
        // Instead, it might expect authorize to return user details,
        // and then it internally calls adapter.getUserByEmail, and if not found,
        // then adapter.createUser.
        // For anonymous users, we always want to create a new one.
        // A common pattern is to return the user profile, and the adapter handles creation.

        const user = {
          id: uuid, // Provide an ID for the session, adapter might use its own
          email: uniqueEmail,
          name: "Guest User",
          isAnonymous: true, // Custom field
          // emailVerified can be omitted or set to null/Date depending on schema and adapter
          // For anonymous users, email verification is not applicable.
          // The schema has `emailVerified` as NOT NULL, DEFAULT CURRENT_TIMESTAMP(3)
          // So, we don't need to set it here; DB default will take over.
        };

        // When using an adapter, the authorize function should typically return
        // a user object that matches what the adapter would expect to find or create.
        // The adapter's createUser method will be called by NextAuth core if
        // getUserByEmail (or similar) doesn't find the user.
        return user;
      },
    }),
  ],
  callbacks: {
    // If you need to add isAnonymous to the session or token, you'd do it here.
    // For example:
    async session({ session, token }) {
      if (session.user && token.isAnonymous) {
        (session.user as any).isAnonymous = token.isAnonymous;
      }
      if (session.user && token.sub) {
        // token.sub is usually the user id from the provider
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user && (user as any).isAnonymous) {
        token.isAnonymous = (user as any).isAnonymous;
      }
      // if (user) { // Persist the user's ID to the token
      //   token.sub = user.id;
      // }
      return token;
    },
  },
});
