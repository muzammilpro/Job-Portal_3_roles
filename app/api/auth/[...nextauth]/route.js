
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {},
//         password: {},
//       },
//       async authorize(credentials) {
//         await connectDB();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) {
//           throw new Error("User not found");
//         }

//         const isMatch = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isMatch) {
//           throw new Error("Invalid password");
//         }

//         return {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user && token?.role) {
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   providers: [
//     // ✅ GOOGLE LOGIN
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),

//     // ✅ EMAIL + PASSWORD LOGIN
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectDB();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) {
//           throw new Error("User not found");
//         }

//         const isMatch = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isMatch) {
//           throw new Error("Invalid password");
//         }

//         return {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     // 🔐 Runs on every login (Google + Credentials)
//     async signIn({ user, account }) {
//       if (account.provider === "google") {
//         await connectDB();

//         const existingUser = await User.findOne({ email: user.email });

//         if (!existingUser) {
//           await User.create({
//             name: user.name,
//             email: user.email,
//             role: "user", // default role
//             password: null, // Google users don't need password
//             image: user.image,
//           });
//         }
//       }
//       return true;
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role || "user";
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },

//   session: {
//     strategy: "jwt",
//   },

//   pages: {
//     signIn: "/login",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   providers: [
//     // ✅ GOOGLE LOGIN
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),

//     // ✅ EMAIL + PASSWORD LOGIN
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectDB();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) throw new Error("User not found");

//         const isMatch = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );
//         if (!isMatch) throw new Error("Invalid password");

//         return {
//           id: user._id.toString(), // ✅ STRING
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         };
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   callbacks: {
//     async signIn({ user, account }) {
//       await connectDB();

//       if (account.provider === "google") {
//         let dbUser = await User.findOne({ email: user.email });

//         if (!dbUser) {
//           dbUser = await User.create({
//             name: user.name,
//             email: user.email,
//             role: "company",
//             password: null,
//             image: user.image,
//           });
//         }

//         user.id = dbUser._id.toString();
//         user.role = dbUser.role;
//       }

//       return true;
//     },

//     async jwt({ token, user }) {
//       // 🔥 FIRST LOGIN
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//         token.email = user.email;
//       }

//       // 🔥 FALLBACK (CRITICAL FIX)
//       if (!token.id && token.email) {
//         await connectDB();
//         const dbUser = await User.findOne({ email: token.email }).select("_id role");

//         if (dbUser) {
//           token.id = dbUser._id.toString();
//           token.role = dbUser.role;
//         }
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       session.user.id = token.id;     // ✅ ALWAYS EXISTS NOW
//       session.user.role = token.role;
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/authOptions";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
