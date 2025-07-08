
import OpenAI from 'openai';

// Types for message structure
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Gets the OpenAI API key from localStorage or environment variable
 */
export const getOpenAIApiKey = (): string => {
  // Try to get from localStorage first
  const localStorageKey = localStorage.getItem('openai-api-key');
  if (localStorageKey) {
    return localStorageKey;
  }
  
  // Fall back to environment variable
  return import.meta.env.VITE_OPEN_AI_API_KEY || '';
};

/**
 * Validates the OpenAI API key format
 * @param key The API key to validate
 * @returns boolean indicating if the key has valid format
 */
export const validateApiKeyFormat = (key: string): boolean => {
  // Basic validation: OpenAI API keys start with "sk-"
  return key.trim().startsWith('sk-');
};

// Create a new OpenAI instance (will be recreated when API key changes)
const createOpenAIInstance = () => {
  const currentKey = getOpenAIApiKey();
  return new OpenAI({
    apiKey: currentKey || 'dummy-key', // Use dummy key to prevent constructor error
    dangerouslyAllowBrowser: true, // Required when making API calls directly from the browser
  });
};

/**
 * Sends a chat completion request to the OpenAI API
 * @param messages Array of message objects to send to the API
 * @returns The response from the OpenAI API
 */
export async function getChatCompletion(messages: Message[]): Promise<string> {
  try {
    // Get the current API key
    const currentApiKey = getOpenAIApiKey();
    
    // Validate the API key
    if (!currentApiKey) {
      throw new Error('OpenAI API key not configured. Please add your API key in the settings.');
    }

    // Create a fresh instance with the current key
    const openai = createOpenAIInstance();

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Updated to use a more current model
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Return the response message
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error in OpenAI service:', error);
    
    // Return different message based on error type
    if (error instanceof Error && error.message.includes('API key')) {
      return 'I cannot respond right now because the OpenAI API key is not configured correctly. Please add your API key in the settings.';
    }
    
    throw new Error('Failed to get AI response');
  }
}

/**
 * Generates speech from text using OpenAI's TTS API
 * @param text The text to convert to speech
 * @param language The language code (e.g., 'en', 'da')
 * @returns A URL to the audio blob
 */
export async function generateSpeech(text: string, language: string = 'en'): Promise<string> {
  try {
    // Get the current API key
    const currentApiKey = getOpenAIApiKey();
    
    if (!currentApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!validateApiKeyFormat(currentApiKey)) {
      throw new Error('Invalid API key format');
    }

    // Select appropriate voice based on language
    // OpenAI's TTS API voices that work well for different languages
    const voice = language === 'da' ? 'shimmer' : 'alloy';
    console.log(`Generating speech in ${language} using voice: ${voice}`);
    
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: voice,
        input: text,
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('TTS API error:', response.status, errorData);
      throw new Error(`TTS API error: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error('Could not generate speech. Please check your API key.');
  }
}
