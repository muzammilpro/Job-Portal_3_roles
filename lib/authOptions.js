import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatch) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      if (account.provider === "google") {
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // Default to "company" role for Google OAuth
          // The client-side code may have set a preferred role in sessionStorage
          // which will be handled by the callback page
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            role: "company", // Default role, may be updated by callback page
            password: null,
            image: user.image,
          });
        }

        user.id = dbUser._id.toString();
        user.role = dbUser.role;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }

      if (!token.id && token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email }).select("_id role");

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
