export default async function handler(req, res) {
    if(req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const { prompt } = req.body;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            max_tokens: 6000,
            reasoning_effort: 'low',    
            messages: [{ role: 'user', content: prompt }]
        })
    });
    const data = await response.json();
    return res.status(200).json(data);
}
