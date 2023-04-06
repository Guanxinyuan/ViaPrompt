import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { dummyResponses } from '@/data/cards';

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const config = {
  runtime: 'edge'
};

export default async (req, res) => {
  const requestBody = JSON.parse(await req.text());
  const { prompt, mode, model } = requestBody;
  console.log('Prompt:', prompt);

  const response = dummyResponses[mode];
  const message = response ? response.choices[0].message.content : null;

  let cardData = {
    mode: mode,
    model: model,
    original_prompt: prompt,
    user_id: '62cb4f7b-a359-4cf2-a808-ac5edee77d81',
  };

  switch (mode) {
    case 'optimize': cardData = { ...cardData, answer: message }; break;
    case 'decompose': cardData = { ...cardData, answer: message }; break;
    case 'template': cardData = { ...cardData, answer: prompt }; break;
  }

  const { data, error } = await supabaseClient.from('tempCards').insert(cardData);
  if (error) {
    console.log('Error:', error.message);
    throw new Error(error.message);
  }
  console.log('Insertion success');

  return NextResponse.json(cardData);
};
