import { createServerRunner } from "@aws-amplify/adapter-nextjs";

import config from "./AmplifyConfig";

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});
