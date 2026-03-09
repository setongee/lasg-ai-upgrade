export const getKeywordGenerationPrompt = (serviceName, serviceDescription, mdaName) => {
  return `You are a keyword generation expert specializing in government services and public administration. 

TASK: Generate exactly 12 highly relevant, single-word or short-phrase keywords for a government service.

CONTEXT:
- Service Name: "${serviceName}"
- Service Description: "${serviceDescription}"
- Providing Agency: "${mdaName}" (Lagos State Government Agency)

REQUIREMENTS:
1. Generate exactly 12 keywords
2. Keywords must be single words or short phrases (2-3 words max)
3. Focus on: service functionality, user benefits, government processes, and relevant terminology
4. Consider Lagos State context and Nigerian public service terminology
5. Rank keywords by relevance and search volume (most important first)
6. Avoid generic terms, focus on specific, actionable keywords
7. Include terms that citizens would actually search for

OUTPUT FORMAT:
Return ONLY a JSON array of objects with this exact structure:
[
  {"key": "keyword1"},
  {"key": "keyword2"},
  {"key": "keyword3"},
  ...
]

EXAMPLE:
If service is "Driver's License Renewal", output:
[
  {"key": "drivers license"},
  {"key": "license renewal"},
  {"key": "vehicle registration"},
  {"key": "road safety"},
  {"key": "transportation"},
  {"key": "documentation"},
  {"key": "government services"},
  {"key": "LASDRI"},
  {"key": "vehicle permit"},
  {"key": "traffic management"},
  {"key": "public service"},
  {"key": "official documents"}
]

Generate keywords based on the provided service information.`;
};
