import { NextResponse } from 'next/server';
import { dummyResponses } from '@/data/cards';
import supabaseClient from '@/lib/supabase';

export const config = {
  runtime: 'edge'
};

export default async (req, res) => {
  const requestBody = JSON.parse(await req.text());
  const { prompt, mode, model, user_id } = requestBody;
  console.log('Prompt:', prompt);

  const response = dummyResponses[mode];
  const message = response ? response.choices[0].message.content : null;

  let cardData = {
    mode: mode,
    model: model,
    prompt: prompt,
    user_id: user_id,
  };

  switch (mode) {
    case 'optimize': cardData = { ...cardData, answer: message }; break;
    case 'decompose': cardData = { ...cardData, answer: message }; break;
    case 'template': cardData = { ...cardData, answer: prompt }; break;
  }

  console.log(cardData)
  const { data, error } = await supabaseClient.from('tempCards').insert(cardData);
  // const { data, error } = await supabaseClient.from('tempCards').select('prompt')
  if (error) {
    console.log('Error:', error);
    throw new Error('In testSupbase ' + error.message);
  }
  console.log('Insertion success');

  return NextResponse.json({ success: true, data: cardData });
};
