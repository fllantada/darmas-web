import Script from "next/script";

export const HomeScripts = () => {
  return (
    <Script>
      {`
        console.log('Home Scripts');
        `}
    </Script>
  );
};
