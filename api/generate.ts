export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { specInput } = req.body;

  if (!specInput) {
    return res.status(400).json({ error: 'No spec input provided' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `You are a plumbing product description parser. Extract product information from spec sheets and generate descriptions following these EXACT rules:

DESCRIPTION FORMAT RULES:
1. Collection name FIRST (all caps)
2. Handle type if applicable (LEVER HANDLE, CROSS HANDLE, etc.)
3. Mounting type (WALLMOUNT, DECKMOUNT)
4. For 3-HOLE LAV FAUCET, add "8"" before LAV FAUCET
5. Product type (LAV FAUCET, KITCHEN FAUCET, TUB FILLER, SINK, etc.)
6. For tub fillers with multiple pieces, write piece count (e.g., 5PC)
7. Specifications (UNDERMOUNT, dimensions for sinks, etc.)
8. Accessories (w/DRAIN, w/HANDSHOWER, etc.)
9. Finish/color LAST (all caps)
10. If trim only (no rough-in), add TRIM
11. If it's a part, add (PARTS) at the end

EXAMPLES:
- APOLLO LEVER HANDLE 8" LAV FAUCET BRUSHED NICKEL w/POLISHED NICKEL INSERT
- ARCA LEVER HANDLE 8" LAV FAUCET C-SPOUT w/DRAIN CHROME
- BARAZZA RADIUS 15 QUADRE UNDERMOUNT KITCHEN SINK 12.25 x 17 3/4" w/DRAIN
- 5PC DECKMOUNT TUB FILLER w/HANDSHOWER VALVE ROUGH-IN

Parse the following spec sheet text and extract ALL products. For each product, return a JSON array with:
- productCode: Generate a code like XXX-YY-#### (collection prefix, type prefix, random 4 digits)
- collection: Collection name
- productType: Type of product
- description: Full description following the rules above
- finish: The finish/color

Spec text:
${specInput}

Return ONLY valid JSON array, no explanation. Format:
[
  {
    "productCode": "APO-LF-1234",
    "collection": "APOLLO",
    "productType": "LAV FAUCET",
    "description": "APOLLO LEVER HANDLE 8" LAV FAUCET CHROME",
    "finish": "CHROME"
  }
]`,
          },
        ],
      }),
    });

    const data = await response.json();

    // Return the Claude response
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to process request', details: error.message });
  }
}
