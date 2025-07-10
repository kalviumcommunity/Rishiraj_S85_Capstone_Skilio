const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate personalized skill suggestions
const generateSkillSuggestions = async (userProfile, existingSkills) => {
  try {
    const prompt = `
    Based on the following user profile and existing skills in our skill exchange platform, suggest 6 personalized skill recommendations.
    
    User Profile:
    - Name: ${userProfile.name}
    - Bio: ${userProfile.bio || 'Not provided'}
    - Location: ${userProfile.location || 'Not provided'}
    - Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
    - Skills Offered: ${userProfile.skillsOffered?.map(s => s.title).join(', ') || 'None'}
    - Skills Wanted: ${userProfile.skillsWanted?.map(s => s.title).join(', ') || 'None'}
    
    Available Skills in Platform:
    ${existingSkills.map(skill => `- ${skill.title} (${skill.category})`).join('\n')}
    
    Please suggest 6 skills that would be most relevant for this user to either offer or seek, considering:
    1. Their existing skills and interests
    2. Complementary skills that would enhance their profile
    3. Skills that are in demand and would increase their match potential
    4. Skills that align with their location and market needs
    
    Return the response as a JSON array with objects containing:
    {
      "skillId": "the_skill_id",
      "reason": "why this skill is recommended",
      "type": "offering" or "seeking",
      "confidence": 0.0-1.0
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to basic recommendations
    return generateFallbackSuggestions(userProfile, existingSkills);
  }
};

// Generate smart match score
const calculateMatchScore = async (user1, user2, skill1, skill2) => {
  try {
    const prompt = `
    Calculate a match score (0-100) between two users for a skill exchange.
    
    User 1 (${user1.name}):
    - Skills Offered: ${user1.skillsOffered?.map(s => s.title).join(', ')}
    - Skills Wanted: ${user1.skillsWanted?.map(s => s.title).join(', ')}
    - Rating: ${user1.rating}
    - Location: ${user1.location}
    
    User 2 (${user2.name}):
    - Skills Offered: ${user2.skillsOffered?.map(s => s.title).join(', ')}
    - Skills Wanted: ${user2.skillsWanted?.map(s => s.title).join(', ')}
    - Rating: ${user2.rating}
    - Location: ${user2.location}
    
    Exchange:
    - User 1 offering: ${skill1.title} (${skill1.category})
    - User 2 offering: ${skill2.title} (${skill2.category})
    
    Consider factors like:
    1. Skill compatibility and demand
    2. User ratings and reliability
    3. Location proximity
    4. Overall profile alignment
    
    Return only the numeric score (0-100).
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 10,
    });

    const score = parseInt(completion.choices[0].message.content);
    return Math.min(Math.max(score, 0), 100); // Ensure score is between 0-100
  } catch (error) {
    console.error('OpenAI match score error:', error);
    // Fallback to basic scoring
    return calculateFallbackMatchScore(user1, user2, skill1, skill2);
  }
};

// Generate skill descriptions
const generateSkillDescription = async (skillTitle, category) => {
  try {
    const prompt = `
    Generate a compelling, professional description for a skill in a skill exchange platform.
    
    Skill: ${skillTitle}
    Category: ${category}
    
    The description should:
    1. Be 2-3 sentences long
    2. Highlight the value and benefits
    3. Be engaging and professional
    4. Encourage skill exchanges
    
    Return only the description text.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI description error:', error);
    return `Learn and master ${skillTitle} through skill exchanges with our community.`;
  }
};

// Fallback functions for when OpenAI is unavailable
const generateFallbackSuggestions = (userProfile, existingSkills) => {
  // Basic logic for skill suggestions
  const suggestions = existingSkills
    .filter(skill => !userProfile.skillsOffered?.some(s => s._id.toString() === skill._id.toString()))
    .slice(0, 6)
    .map(skill => ({
      skillId: skill._id,
      reason: "Popular skill in high demand",
      type: "offering",
      confidence: 0.6
    }));
  
  return suggestions;
};

const calculateFallbackMatchScore = (user1, user2, skill1, skill2) => {
  let score = 50; // Base score
  
  // Add points for rating similarity
  const ratingDiff = Math.abs(user1.rating - user2.rating);
  score += (5 - ratingDiff) * 5;
  
  // Add points for location proximity (if same location)
  if (user1.location === user2.location) {
    score += 20;
  }
  
  // Add points for skill category match
  if (skill1.category === skill2.category) {
    score += 15;
  }
  
  return Math.min(Math.max(score, 0), 100);
};

module.exports = {
  generateSkillSuggestions,
  calculateMatchScore,
  generateSkillDescription
}; 