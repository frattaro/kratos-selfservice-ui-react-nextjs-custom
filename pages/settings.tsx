import { Card, CardHeader, CardActions, Typography } from "@mui/material";
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

import { useToast } from "../hooks";
import { Flow, Methods, Messages } from "../pkg";
import { handleFlowError } from "../pkg/errors";
import ory from "../pkg/sdk";

interface Props {
  flow?: SettingsFlow;
  only?: Methods;
}

function SettingsCard({
  flow,
  only,
  children
}: Props & { children: ReactNode }) {
  if (!flow) {
    return null;
  }

  const nodes = only
    ? flow.ui.nodes.filter(({ group }) => group === only)
    : flow.ui.nodes;

  if (nodes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardActions>{children}</CardActions>
    </Card>
  );
}

const Settings: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>();
  const toast = useToast();

  // Get ?flow=... from the URL
  const router = useRouter();
  const { flow: flowId, return_to: returnTo } = router.query;

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleFlowError(router, "settings", setFlow, toast));
      return;
    }

    // Otherwise we initialize it
    ory
      .createBrowserSettingsFlow({
        returnTo: returnTo ? String(returnTo) : undefined
      })
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "settings", setFlow, toast));
  }, [flowId, router, router.isReady, returnTo, flow, toast]);

  const onSubmit = (values: UpdateSettingsFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/settings?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateSettingsFlow({
            flow: String(flow?.id),
            updateSettingsFlowBody: values
          })
          .then(({ data }) => {
            // The settings have been saved and the flow was updated. Let's show it to the user!
            setFlow(data);
          })
          .catch(handleFlowError(router, "settings", setFlow, toast))
          .catch(async (err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data);
              return;
            }

            return Promise.reject(err);
          })
      );

  return (
    <>
      <Head>
        <title>
          Profile Management and Security Settings - Ory NextJS Integration
          Example
        </title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <Card>
        <CardHeader
          style={{ marginTop: 80 }}
          title="Profile Management and Security Settings"
        />
      </Card>
      <SettingsCard only="profile" flow={flow}>
        <Typography variant="h3">Profile Settings</Typography>
        <Messages messages={flow?.ui.messages} />
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="profile"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard only="password" flow={flow}>
        <Typography variant="h3">Change Password</Typography>

        <Messages messages={flow?.ui.messages} />
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="password"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard only="oidc" flow={flow}>
        <Typography variant="h3">Manage Social Sign In</Typography>

        <Messages messages={flow?.ui.messages} />
        <Flow hideGlobalMessages onSubmit={onSubmit} only="oidc" flow={flow} />
      </SettingsCard>
      <SettingsCard only="lookup_secret" flow={flow}>
        <Typography variant="h3">Manage 2FA Backup Recovery Codes</Typography>
        <Messages messages={flow?.ui.messages} />
        <p>
          Recovery codes can be used in panic situations where you have lost
          access to your 2FA device.
        </p>

        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="lookup_secret"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard only="totp" flow={flow}>
        <Typography variant="h3">Manage 2FA TOTP Authenticator App</Typography>
        <p>
          Add a TOTP Authenticator App to your account to improve your account
          security. Popular Authenticator Apps are{" "}
          <a href="https://www.lastpass.com" rel="noreferrer" target="_blank">
            LastPass
          </a>{" "}
          and Google Authenticator (
          <a
            href="https://apps.apple.com/us/app/google-authenticator/id388497605"
            target="_blank"
            rel="noreferrer"
          >
            iOS
          </a>
          ,{" "}
          <a
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
            target="_blank"
            rel="noreferrer"
          >
            Android
          </a>
          ).
        </p>
        <Messages messages={flow?.ui.messages} />
        <Flow hideGlobalMessages onSubmit={onSubmit} only="totp" flow={flow} />
      </SettingsCard>
      <SettingsCard only="webauthn" flow={flow}>
        <Typography variant="h3">
          Manage Hardware Tokens and Biometrics
        </Typography>
        <Messages messages={flow?.ui.messages} />
        <p>
          Use Hardware Tokens (e.g. YubiKey) or Biometrics (e.g. FaceID,
          TouchID) to enhance your account security.
        </p>
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="webauthn"
          flow={flow}
        />
      </SettingsCard>
      <Card>
        <CardActions>
          <Link href="/">Go back</Link>
        </CardActions>
      </Card>
    </>
  );
};

export default Settings;
