/**
 *
 */

import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from "openai";
import { PrismaClient } from "@prisma/client"
import {authOptions} from "@/lib/auth";
import { getServerSession } from "next-auth/next"
import { User } from "next-auth";

const prisma = new PrismaClient();
// Required Imports
import fetch from 'node-fetch';

require('dotenv').config(); // Load environment variables



// Function to create or retrieve an FDAI user's access token linked to your system's user ID
async function getDfdaUser() {
  const yourUserId = getLoggedInUserId(); // You'll need to implement this function to get the user ID
  // Attempt to fetch the user from your database
  let your_user = await prisma.user.findUnique({
    where: { id: yourUserId }
  });

  // Check if the user already has an FDAI access token and return if exists
  if (your_user && your_user.dfda_access_token) {
    return your_user.dfda_access_token;
  }

  // If not, create a new FDAI user using the API
  let response = await fetch(`https://safe.dfda.earth/api/v1/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-ID': process.env.DFDA_CLIENT_ID,
      'X-Client-Secret': process.env.DFDA_CLIENT_SECRET
    },
    body: JSON.stringify({ clientUserId: yourUserId })
  });

  response = await response.json();
  const dfdaUser = response.user;

  // Update your user data with FDAI user access token details
  await prisma.user.update({
    where: { id: yourUserId },
    data: {
      dfda_user_id: dfdaUser.id,
      dfda_access_token: dfdaUser.accessToken,
      dfda_refresh_token: dfdaUser.refreshToken,
      dfda_access_token_expires_at: new Date(dfdaUser.accessTokenExpires).toISOString()
    }
  });

  // Return the FDAI user's access token
  return dfdaUser;
}

async function postMeasurements(dfdaUser, measurements) {
  const response = await fetch(`https://safe.dfda.earth/api/v1/measurements`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${dfdaUser.accessToken}`
    },
    body: JSON.stringify({
      measurements
    })
  });
}

  const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
  body: '[{"startAt":"<string>","value":123,"variableCategoryName":"Activity","variableName":"<string>","unitAbbreviatedName":"<string>","combinationOperation":"MEAN","sourceName":"<string>","upc":"<string>","note":"<string>"}]'
};

fetch('https://safe.dfda.earth/api/v3/measurements/post', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
}

// // Initialize the OpenAI client with the API key. This key is essential for authenticating
// // the requests with OpenAI's API services.
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// Define an async function to handle the call
export async function POST(request: NextRequest) {
  // Logging the start of the image processing API call
  console.log('Starting the voice processing API call');

  // Extracting the file (in base64 format) and an optional custom prompt
  // from the request body. This is essential for processing the image using OpenAI's API.

  const session = await getServerSession(authOptions);
  const userId = session?.user;
  const id = session.user.id;

  // call text2measurements
  try {
    // Define the input text for the prompt (hardcoding to test for now)
    const inputText = "Your prompt text goes here.";

    // Create the request object with JSON containing the "prompt" field
    const requestObject = {
      prompt: inputText,
      userId: userId,
      id: id
    };

    // Make the call to the POST function with the request object
    const response = await POST({
      json: () => Promise.resolve(requestObject) // Mocking the json() method to return the request object
    });

    const responseData = await response.json();

    // Check if the call was successful
    if (responseData.success) {
      // Access measurements from the response
      const measurements = responseData.measurements;
      console.log('Measurements:', measurements);

      const dfdaUser = getDfdaUser();
      postMeasurements(dfdaUser, measurements);

    } else {
      // Handle unsuccessful response
      console.error('Error:', responseData.message);
    }

    // Handle the response here
    console.log(response);
  } catch (error) {
    // Handle errors if any
    console.error('Error:', error);
  }


}
