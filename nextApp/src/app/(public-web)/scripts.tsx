import Script from "next/script";

export const HomeScripts = () => {
  return (
    <Script id={"ES-id-unico"}>
      {`
        console.log('Home Scripts');
        `}
    </Script>
  );
};
