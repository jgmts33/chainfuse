import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import env from "../core/env.js";
import router from "../core/router.js";

// const client = new TextToSpeechClient();

const USER_PARAMS = {
  name: "name",
  email: "email",
};

const PARAMS = {
  to: "to",
  from: "from",
  subject: "subject",
  messsage: "message",
  category: "category",
  name: USER_PARAMS.name,
  date: "date",
  location: "location",
  attendants: `attendants[${USER_PARAMS.email}, ${USER_PARAMS.name}]`,
  email: USER_PARAMS.email,
  command: "command",
  schedule: "schedule",
};

const COMMANDS = {
  sendEmail: {
    command: `sendEmail(${PARAMS.to}, ${PARAMS.from}, ${PARAMS.subject}, ${PARAMS.messsage})`,
    description: "sends an email to a person.",
  },
  sendText: {
    command: `sendText(${PARAMS.to}, ${PARAMS.messsage})`,
    description: "sends a text message to a person.",
  },
  sendPushNotification: {
    command: `sendPushNotification(${PARAMS.category}, ${PARAMS.messsage})`,
    description: "sends a push notification.",
  },
  scheduleMeeting: {
    command: `scheduleMeeting(${PARAMS.name}, ${PARAMS.date}, ${PARAMS.location}, ${PARAMS.attendants})`,
    description: "schedules a meeting with someone.",
  },
  reachOut: {
    command: `reachOut(${PARAMS.to}, ${PARAMS.command}, ${PARAMS.schedule})`,
    description:
      "asks the AI to create a CRON schedule that pings the user and engages the user with the prompt's command, using the user's phone number, and asks one if there is none.",
  },
};

const PROMPTS = {
  command: `
    The following AI creates commands based on the input given by humans.
    The functions registered are:
    ${COMMANDS.sendEmail.command} which ${COMMANDS.sendEmail.description},
    ${COMMANDS.sendText.command} which ${COMMANDS.sendText.description},
    ${COMMANDS.sendPushNotification.command} which ${COMMANDS.sendPushNotification.description},
    ${COMMANDS.scheduleMeeting.command} which ${COMMANDS.scheduleMeeting.description},
    ${COMMANDS.reachOut.command} which ${COMMANDS.reachOut.description},
    Depending on the human input, the appropriate input must be routed to the right command based on context.
    If context does not match well, return "unknown command".
    The support team's email is hello@chainfuse.com.
    The person who owns this AI is George Portillo.
    George Portillo works at ChainFuse.com
    George's email is george@chainfuse.com
    George's phone number is +5107784677
    Chainfuse is a company that uses AI and Blockchain to provide event insight for web3 businesses.`,
};

router.get("/favicon.ico", (_, res) => {
  res.status(204);
  res.end();
});

router.get("/api/echo", (req, res) => {
  res.send({
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    hostname: req.hostname,
    env: req.query.env && {
      ...process.env,
      CLOUDFLARE_API_TOKEN: undefined,
      GOOGLE_CLOUD_CREDENTIALS: undefined,
    },
    headers: req.headers,
    arch: process.arch,
    platform: process.platform,
    release: process.release,
    version: process.version,
    versions: process.versions,
  });
});

router.post("/api/ai", async (req, res) => {
  try {
    const type = req.body.type;

    // Get user id
    // Get siteId (expect non-site requests also [dashboard])
    // Save message under siteId, and under userId
    // Proceed with AI request

    console.log("type", type);

    if (type === "message") {
      const { textResponse, followUpResponse } = await sendAiMessageRequest(
        req
      );
      res.status(200).json({
        textResponse,
        followUpResponse,
      });
    } else if (type === "command") {
      const { textResponse } = await sendCommandMessageRequest(req);
      console.log("textResponse", textResponse);

      res.status(200).json({
        textResponse,
      });
    } else if (type === "image") {
      const response = await sendAiImageRequest(req);

      console.log("response ===>", JSON.stringify(response.data.error));

      // Respond to client
      res.status(200).json({
        ...response.data,
      });
    } else {
      res.status(500).json({
        error: "No type passed.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

const sendCommandMessageRequest = async (req: any) => {
  const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  // Get entire context based on the deployable intial fields
  // Remove any potential breakages from string
  // Send context and latest message to the AI
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${PROMPTS.command} Human: ${req.body.prompt}`,
    temperature: 1,
    max_tokens: 200,
    top_p: 1,
    best_of: 20,
    frequency_penalty: 1,
    presence_penalty: 1,
    stop: [" Human:", " Command:"],
  });

  // Await for AI's answer and append to the context
  // Save context

  const textResponse = response?.data?.choices?.[0].text;

  // const AiResponse = `${req.body.prompt} AI: ${textResponse}`;

  // const followUpResponse = await openai.createCompletion({
  //   model: "text-davinci-002",
  //   prompt: `${AiResponse}. An AI joined the conversation. The new AI is Followup. The purpose of the AI is to ask a creative follow up question. Followup:`,
  //   temperature: 1,
  //   max_tokens: 200,
  //   top_p: 1,
  //   best_of: 20,
  //   frequency_penalty: 1,
  //   presence_penalty: 1,
  //   stop: [" Human:", " Ai:", "Followup:"],
  // });

  // const questionSection =
  //   followUpResponse?.data?.choices?.[0].text?.split("?")[0];

  // Send multiple questions back to the front end
  // const questionSection = followUpResponse?.data?.choices?.[0].text
  //   ?.split("?")
  //   .map((question) => `${question}?`);

  return {
    textResponse,
    // textResponse,
    // followUpResponse: `${questionSection}?`,
  };
};

const sendAiMessageRequest = async (req: any) => {
  const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  // Get entire context based on the deployable intial fields
  // Remove any potential breakages from string
  // Send context and latest message to the AI
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${req.body.prompt} AI:`,
    temperature: 0.8,
    max_tokens: 200,
    top_p: 1,
    best_of: 20,
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
    stop: [" Human:", " Ai:"],
  });

  // Await for AI's answer and append to the context
  // Save context

  const textResponse = response?.data?.choices?.[0].text;
  const AiResponse = `${req.body.prompt} AI: ${textResponse}`;

  const followUpResponse = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${AiResponse}. An AI joined the conversation. The new AI is Followup. The purpose of the AI is to ask a creative follow up question. Followup:`,
    temperature: 1,
    max_tokens: 200,
    top_p: 1,
    best_of: 20,
    frequency_penalty: 1,
    presence_penalty: 1,
    stop: [" Human:", " Ai:", "Followup:"],
  });

  const questionSection =
    followUpResponse?.data?.choices?.[0].text?.split("?")[0];

  // Send multiple questions back to the front end
  // const questionSection = followUpResponse?.data?.choices?.[0].text
  //   ?.split("?")
  //   .map((question) => `${question}?`);

  return {
    textResponse,
    followUpResponse: `${questionSection}?`,
  };
};

const sendAiImageRequest = async (req: any) => {
  const response = await axios({
    method: "post",
    url: "https://api.openai.com/v1/images/generations",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    data: JSON.stringify({
      prompt: req.body.prompt,
    }),
  });

  return response;
};
