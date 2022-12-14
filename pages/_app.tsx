import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { useState } from "react";

import { CustomThemeProvider } from "../contexts";
import { ToastProvider } from "../contexts";
import { createEmotionCache } from "../utils";

const clientSideEmotionCacheInstance = createEmotionCache(
  typeof document === "undefined"
    ? undefined
    : (document.querySelector('[property="csp-nonce"]') as HTMLMetaElement)
        ?.content
);

const MyApp: React.FC<
  AppProps & {
    emotionCache: EmotionCache;
  }
> = ({ Component, emotionCache, pageProps }) => {
  const [clientSideEmotionCache] = useState(
    emotionCache || clientSideEmotionCacheInstance
  );
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div data-testid="app-react">
        <CacheProvider value={emotionCache || clientSideEmotionCache}>
          <CustomThemeProvider>
            <ToastProvider>
              <Component {...pageProps} />
              <CssBaseline />
            </ToastProvider>
          </CustomThemeProvider>
        </CacheProvider>
      </div>
    </>
  );
};

export default MyApp;
