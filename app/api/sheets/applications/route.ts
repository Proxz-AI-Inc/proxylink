import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const SPREADSHEET_ID = '1b_oBVrmKJiovprPnj69D1qnQ4nMSrHMn1wJfBPjvAWM';
const SHEET_RANGE = 'Sheet1!A:G';

export type ApplicationData = {
  companyName: string;
  companyWebsite: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  phoneNumber: string;
  dateApplied: string;
};

export async function POST(request: Request) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_LOGGING_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_LOGGING_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n',
      ),
      client_id: process.env.GOOGLE_LOGGING_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const data: ApplicationData = await request.json();

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Missing application data' },
        { status: 400 },
      );
    }

    const values = [
      [
        data.companyName,
        data.companyWebsite,
        data.firstName,
        data.lastName,
        data.workEmail,
        data.phoneNumber,
        data.dateApplied,
      ],
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return NextResponse.json({
      success: true,
      updatedRange: response.data.updates?.updatedRange,
    });
  } catch (error) {
    console.error('Error updating sheet:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update sheet' },
      { status: 500 },
    );
  }
}
