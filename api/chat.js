import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sólo se acepta POST" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No se recibió mensaje" });
  }

  try {
    // Mensaje inicial para especializar el bot en tu agencia
    const systemPrompt = `Eres un asistente experto en una agencia de servicios tecnológicos que ofrece soluciones de automatización y chatbots. Responde de manera profesional y clara.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.data.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
