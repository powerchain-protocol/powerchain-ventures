import { InfoPage } from "../../components/content/info-page";

export const metadata = { title: "Legal information" };

export default function Page() {
  return (
    <InfoPage
      eyebrow={"Legal"}
      title={"Legal information"}
      intro={"Review the core legal and privacy surfaces for PowerChain Launchpad."}
      sections={[
        {
                "title": "Terms of use",
                "body": "Rules governing use of the Launchpad, wallet interactions and access to token-sale functionality.",
                "href": "/legal/terms",
                "hrefLabel": "Read terms"
        },
        {
                "title": "Privacy",
                "body": "How account, request and operational data are handled while wallet custody remains with the user.",
                "href": "/legal/privacy",
                "hrefLabel": "Read privacy notice"
        },
        {
                "title": "Cookies",
                "body": "Essential cookies used for sessions, security and mobile onboarding state.",
                "href": "/legal/cookies",
                "hrefLabel": "Read cookie notice"
        }
]}
    />
  );
}
