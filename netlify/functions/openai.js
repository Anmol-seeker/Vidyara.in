const fetch = require('node-fetch');

exports.handler = async function(event) {
  const { prompt } = JSON.parse(event.body);
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an assistant that helps with study material." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ result: data.choices[0].message.content.trim() }),
  };
};
