import { Configuration, FrontendApi } from "@ory/client";

export default new FrontendApi(
  new Configuration({
    basePath: `/api/.ory`,
    accessToken: process.env.ORY_ACCESS_TOKEN
  })
);
