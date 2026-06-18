require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function run() {

  try {

    const chatCompletion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: "Say Hello"
          }
        ],
        model: "llama-3.3-70b-versatile"
      });

    console.log(
      chatCompletion.choices[0].message.content
    );

  } catch (err) {

    console.log(err);

  }

}

run();