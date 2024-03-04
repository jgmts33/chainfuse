import { Site } from "./firestore.js";

const createMetadataString = (
  title: string,
  name: string,
  description: string,
  image: string,
  url: string
) => {
  return `<!-- Primary Meta Tags -->
    <title>${title}</title>

    <!--
    <meta name="title" content="${name}">
    <meta name="description" content="${description}">
    <meta property="image" content="${image}">
    -->

    <!-- Basic OG -->
    <meta name="type" property="og:type" content="website">
    <meta name="url" property="og:url" content="${url}">
    <meta name="title" property="og:title" content="${name}">
    <meta name="description" property="og:description" content="${description}">
    <meta name="image" property="og:image" content="${image}">
  
    <!-- Open Graph / Facebook -->
    <meta property="fb:app_id" content="1297563474388673">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="traveler-ai.chainfuse.com">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${name}">
    <meta property="twitter:description" content="${description}">
    <meta property="twitter:image" content="${image}">
  `;
};

export function transform(
  res: Response,
  envVars: Record<string, string>,
  site: Site
): Response {
  // Object.keys(envVars).reduce(
  //   (acc, key) => ({
  //     ...acc,
  //     [key]:
  //       typeof envVars[key] === "number"
  //         ? envVars[key]
  //         : filterXSS(String(envVars[key])),
  //   }),
  //   {}
  // )

  const ENVER = new HTMLRewriter()
    // <script id="env">
    //   window.__ENV = Object.freeze({ TAGLINE: "...", ... })
    // </script>
    .on("script#env", {
      element(el) {
        el.setInnerContent(
          [
            `Object.defineProperty(window,"__ENV",{value:Object.freeze(${JSON.stringify(
              {
                ...envVars,
              }
            )})});`,
          ].join(""),
          { html: true }
        );
      },
    });

  if (site.template === "profile") {
    return ENVER.on("head", {
      element(el) {
        el.append(
          createMetadataString(
            `${envVars.profileName}'s Decentralized Profile`,
            envVars.profileName,
            envVars.description,
            envVars.avatar,
            "https://chainfuse.com"
          ),
          { html: true }
        );
      },
    }).transform(res);
  } else if (site.template === "marketplace") {
    return ENVER.on("head", {
      element(el) {
        el.append(
          createMetadataString(
            `${envVars.name} - Decentralized Marketplace`,
            envVars.name,
            `${envVars.name} - ${envVars.tagline}`,
            envVars.logoRectangleUrl,
            "https://chainfuse.com"
          ),
          { html: true }
        );
      },
    }).transform(res);
  } else if (site.template === "ai") {
    return ENVER.on("head", {
      element(el) {
        el.append(
          createMetadataString(
            envVars.name,
            envVars.name,
            `Backstory: ${envVars.prompt}`,
            envVars.avatar,
            "https://chainfuse.com"
          ),
          { html: true }
        );
      },
    }).transform(res);
  } else {
    return ENVER.on("head", {
      element(el) {
        el.append(
          createMetadataString(
            `ChainFuse 1-click-deploy template`,
            `ChainFuse 1-click-deploy template`,
            `ChainFuse is a no-code platform that helps you launch your own blockchain-enabled templates.`,
            `...`,
            "https://chainfuse.com"
          ),
          { html: true }
        );
      },
    }).transform(res);
  }
}
