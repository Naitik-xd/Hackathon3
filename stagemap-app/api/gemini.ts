import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

// Initialize Supabase Client (falls back to ANON key if SERVICE key is removed)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Constants
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_HOURS = 3;

async function sendDiscordWebhook(message: string) {
  const webhookUrl = process.env.DC_KEY;
  if (!webhookUrl) return;
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });
  } catch (err) {
    console.error('Failed to send Discord webhook', err);
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, city } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  // Get IP address
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : 'unknown';

  // 1. Fetch IP Tracking Record
  let { data: trackRecord, error: fetchError } = await supabase
    .from('gemini_ip_tracking')
    .select('*')
    .eq('ip_address', ip)
    .single();

  const now = new Date();
  let isFirstChat = false;

  if (!trackRecord) {
    isFirstChat = true;
    trackRecord = {
      ip_address: ip,
      is_perma_banned: false,
      banned_until: null,
      gibberish_count: 0,
      window_start_time: now.toISOString(),
      request_count: 0,
      first_chat_time: now.toISOString(),
    };
  }

  // 2. Check Bans
  if (trackRecord.is_perma_banned) {
    return res.status(403).json({ error: 'You are permanently banned from using this feature.' });
  }

  // 3. Rate Limiting Logic
  let windowStart = new Date(trackRecord.window_start_time);
  const hoursSinceWindowStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);

  if (hoursSinceWindowStart > RATE_LIMIT_WINDOW_HOURS || !trackRecord.window_start_time) {
    // Reset window
    trackRecord.window_start_time = now.toISOString();
    trackRecord.request_count = 1;
  } else {
    if (trackRecord.request_count >= RATE_LIMIT_MAX) {
      if (trackRecord.request_count === RATE_LIMIT_MAX) {
        // Send webhook only on the exact request that breaches the limit to avoid spam
        await sendDiscordWebhook(`🚨 Rate limit exceeded! IP: ${ip} has crossed ${RATE_LIMIT_MAX} requests in 3 hours.`);
        
        // increment so we don't send the webhook again
        await supabase.from('gemini_ip_tracking').upsert({
          ...trackRecord,
          request_count: trackRecord.request_count + 1
        });
      }
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    trackRecord.request_count += 1;
  }

  // Send First Chat Notification
  if (isFirstChat) {
    await sendDiscordWebhook(`🎉 New User! IP: ${ip} just used the AI Assist feature for the first time.`);
  }

  // 4. Generate Event Description
  try {
    const prompt = `You are an event description generator. 
    The user is hosting an event titled "${title}" in the city of "${city || 'Unknown'}".
    Write a fun, engaging, and concise 2-3 sentence description for this event. 
    Then, categorize the event into one of the following exact categories: Music, Arts, Tech, Sports, Food. If none fit perfectly, pick the closest one.
    
    Output your response STRICTLY as a JSON object with this format:
    {
      "description": "Your engaging description here...",
      "category": "Music"
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const replyText = response.text || '{}';
    let result;
    try {
      result = JSON.parse(replyText);
    } catch (e) {
      result = { description: replyText, category: 'Music' };
    }

    // 5. Update Tracking Record
    const { error: upsertError } = await supabase.from('gemini_ip_tracking').upsert(trackRecord);
    if (upsertError) {
      console.error('Failed to upsert IP tracking record:', upsertError);
    }

    return res.status(200).json({ 
      description: result.description, 
      category: result.category 
    });
  } catch (err) {
    console.error('Gemini API failed', err);
    return res.status(500).json({ error: 'Failed to generate AI response' });
  }
}
