import { NextRequest, NextResponse } from 'next/server';
import { text2measurements } from "@/lib/text2measurements";
import { conversation2measurements } from "@/lib/conversation2measurements";
import { postMeasurements} from "@/lib/dfda";
import {getUserId} from "@/lib/getUserId";




export async function POST(request: NextRequest) {
  let { statement, localDateTime, pastStatementsString} = await request.json();
  statement = statement || pastStatementsString;

try {
  
  const {measurements, question} = await conversation2measurements(statement, localDateTime, pastStatementsString);
  const userId = await getUserId();
  if(userId){
    await postMeasurements(measurements, userId)
  }
    return NextResponse.json({ success: true, measurements: measurements, question: question });

  } catch (error) {
    // Log and handle any errors encountered during the request to OpenAI
    console.error('Error sending request to OpenAI:', error);
    return NextResponse.json({ success: false, message: 'Error sending request to OpenAI' });
  }
}

export async function GET(req: NextRequest) {
  const urlParams = Object.fromEntries(new URL(req.url).searchParams);
  const statement = urlParams.statement as string;
  const localDateTime = urlParams.localDateTime as string | null | undefined;

  try {
    const measurements = await text2measurements(statement, localDateTime);
    const userId = await getUserId();
    await postMeasurements(measurements, userId);
    return NextResponse.json({ success: true, measurements: measurements });
  } catch (error) {
    console.error('Error sending request to OpenAI:', error);
    return NextResponse.json({ success: false, message: 'Error sending request to OpenAI' });
  }
}
