// netlify/functions/getApiKey.js
exports.handler = async function (event, context) {
    try {
      const apiKey = process.env.OPENAI_API_KEY; // Replace "MY_API_KEY" with the name of your environment variable
  
      if (!apiKey) {
        throw new Error("API key not found in environment variables");
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({ apiKey }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to retrieve API key" }),
      };
    }
  };
  