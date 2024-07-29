"use client";

import { Amplify } from "aws-amplify";

import config from "./AmplifyConfig";

Amplify.configure(config, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
