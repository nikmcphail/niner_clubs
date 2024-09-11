import { connectDB } from "./mongodb";
import User from "../models/user";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",  // optional, but recommended to be explicit
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Connect to the database
        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: credentials?.email }).select("+password");

        // If user is not found, throw an error
        if (!user) {
          throw new Error("Wrong Email");
        }

        // Compare the provided password with the hashed password stored in the DB
        // TODO: hash passwords (bcrypt?)
        const passwordMatch = await (credentials.password === user.password);

        // If the password doesn't match, throw an error
        if (!passwordMatch) {
          throw new Error("Wrong Password");
        }

        // Return the user object with necessary fields (excluding password)
        return {
          id: user._id,  // Note: `_id` is returned here as `id`
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",  // Use JWT for session strategy
  },
  callbacks: {
    // Customize JWT to include user ID
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
      }
      return token;
    },
    // Customize session to include the user ID in the session object
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.firstname = token.firstname;
        session.user.lastname = token.lastname;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};