// MOCK ONLY — stands in for the future backend AI endpoint. A simple keyword heuristic
// that returns the same shape the real service will: it only ever *suggests*;
// the warden makes the final decision.
const RULES = [
  { words: ['spark', 'shock', 'fire', 'smoke', 'burn', 'short circuit'], category: 'electrical', priority: 'critical', reason: 'Potential electrical or fire safety hazard.' },
  { words: ['flood', 'overflow', 'burst', 'sewage'], category: 'plumbing', priority: 'high', reason: 'Water damage or hygiene risk if left unattended.' },
  { words: ['leak', 'tap', 'drain', 'water'], category: 'plumbing', priority: 'high', reason: 'Ongoing water loss can damage the room.' },
  { words: ['wifi', 'wi-fi', 'internet', 'network'], category: 'internet', priority: 'medium', reason: 'Affects studies but is not a safety issue.' },
  { words: ['broken', 'hinge', 'door', 'wardrobe', 'chair', 'bed', 'cupboard'], category: 'furniture', priority: 'medium', reason: 'Affects daily use of the room.' },
  { words: ['dirty', 'clean', 'garbage', 'dust', 'smell'], category: 'cleaning', priority: 'low', reason: 'Comfort issue with no safety impact.' },
];

export function analyzeComplaint({ title, description, category }) {
  const text = `${title} ${description}`.toLowerCase();
  const match = RULES.find((rule) => rule.words.some((word) => text.includes(word)));
  const firstSentence = description.trim().split(/(?<=[.!?])\s/)[0];
  return {
    suggestedCategory: match?.category ?? category,
    suggestedPriority: match?.priority ?? 'medium',
    priorityReason: match?.reason ?? 'No urgent risk detected from the description.',
    simplifiedDescription: firstSentence.length > 160 ? `${firstSentence.slice(0, 157)}…` : firstSentence,
  };
}
