const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  try {
    const { prompt } = JSON.parse(event.body);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or gpt-4 if enabled
      messages: [
        {
          role: "system",
          content: "You are a helpful study assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "No output received.";
    
    return {
      statusCode: 200,
      body: JSON.stringify({ text: result }),
    };
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
