"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ConfigureAmplifyClientSide from "@/utils/ConfigureAmplifyClientSide";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";

import LoadingCenter from "@/components/LoadingCenter";

import "@aws-amplify/ui-react/styles.css";
import "./styles.scss";

function Redirecter() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const router = useRouter();

  const authenticatorComponents = {
    Header() {
      return (
        <div className="bg-primary p-5">
          <Image
            width={223}
            height={52}
            className="mx-auto"
            src="/images/oneocean-white.png"
            alt="OneOcean"
          />
        </div>
      );
    },
  };

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace("/");
    }
  }, [router, authStatus]);

  return (
    <>
      {authStatus == "configuring" && <LoadingCenter text="Loading..." />}
      {authStatus !== "authenticated" && (
        <Authenticator
          loginMechanisms={["email"]}
          hideSignUp={true}
          components={authenticatorComponents}
        />
      )}
      {authStatus === "authenticated" && <LoadingCenter text="Signing in..." />}
    </>
  );
}

export default function NextJsAuthenticator() {
  return (
    <Authenticator.Provider>
      <ConfigureAmplifyClientSide />
      <Redirecter />
    </Authenticator.Provider>
  );
}
