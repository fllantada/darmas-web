import { Metadata } from "next";

import NextJsAuthenticator from "./authenticator";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function Login() {
  // This allows for the environment variables to be used in the browser
  return <NextJsAuthenticator />;
}
