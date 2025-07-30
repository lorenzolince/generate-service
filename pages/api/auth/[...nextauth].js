
import jwt from 'jsonwebtoken';
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github";

import CredentialsProvider from "next-auth/providers/credentials";
import fetch from 'node-fetch'

const options = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
    jwt: true,
    maxAge: (parseInt(process.env.EXPIRE_SESSION, 10) * 60),
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: { scope: "read:user user:email" },
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          console.log("authorize API_ENDPOINT", process.env.API_ENDPOINT);
          const response = await fetch(
            `${process.env.API_ENDPOINT}/api/auth/signin`,
            {
              method: "POST",
              credentials: "include",
              body: JSON.stringify({
                username: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );
          if (!response.ok) {
            throw new Error("Autenticación fallida");
          }
          const data = await response.json();
          if (response.status == 200) {
            return {
              name: data.username,
              email: data.email,
              image: "",
              accessToken: data.token,
              role: data.role,
            };
          }
          return null;
        } catch (error) {
          console.error("Error en autorización:", error.message);
          throw new Error("Credenciales inválidas, por favor intenta nuevamente");
        }
      },
    }),
    {
      idToken: true,
      state: false,
    },
  ],
  pages: {
    signOut: '/auth/signout',
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      console.log("-------------------  callbacks -----------------------------------", process.env.API_ENDPOINT);
      console.log("id", user.id);
      console.log("name", user.name);
      console.log("email", user.email);
      console.log("image", user.image);
      console.log("provider", account.provider);
      try {
        const response = await fetch(
          `${process.env.API_ENDPOINT}/api/auth/signinProvider`,
          {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
              id: user.id,
              provider: account.provider,
              username: user.name,
              email: user.email,
              image: user.image,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) {
          throw new Error("Autenticación fallida");
        }
        const data = await response.json();
        if (response.status == 200) {
          console.error("data:", data);
          if (data.duplicate) {
            console.error("duplicate:", data.duplicate);
            throw new Error("SESSION_DUPLICADA");
          }
          user.accessToken = data.token;
          user.role = data.role;
          return Promise.resolve(true);
        }
        return null;
      } catch (error) {
        console.error("Error en autorización:", error.message);
        throw new Error(error.message);
      }

    },
    async jwt({ user, token, account }) {
      if (user) {
        token.user = user;
      }
      if (account) {
        token.provider = account.provider; // Guardar el proveedor en el token
      }

      return token;
    },
    session: async (data) => {
      let session = data.session
      let user = data.token.user
      const now = new Date();
      session.clientToken = user.accessToken
      let role = user.role[0].authority
      let rol = role.split("_")
      session.role = rol[1];
      session.user.email = user.email
      const jwtParsed = jwt.decode(session.clientToken, process.env.NEXTAUTH_SECRET);
      if (jwtParsed) {
        session.expires = (new Date(jwtParsed.exp * 1000)).toISOString();
        data.token.exp = jwtParsed.exp
        data.token.iat = jwtParsed.iat
        const unixTimestamp = jwtParsed.exp;
        const milliseconds = unixTimestamp * 1000;
        const expiredDateToken = new Date(milliseconds);
        const diffMs = expiredDateToken - now; // Math.abs(expiredDateToken - now);
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        session.tknExp = expiredDateToken;
        session.tknMins = diffMins > 0 ? diffMins : 0;
      }

      return Promise.resolve(session)
    }
  },
  debug: process.env.AUTH_DEBUG,
}

export default (req, res) => NextAuth(req, res, options)