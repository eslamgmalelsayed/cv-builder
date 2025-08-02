exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify({
      message: "Netlify function is working!",
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      hasGroqKey: !!process.env.GROQ_API_KEY,
      nodeEnv: process.env.NODE_ENV
    })
  };
};
