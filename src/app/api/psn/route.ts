import { NextResponse } from "next/server";
import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getFriendsList, 
  getBasicPresence,
  getUserTitles
} from "psn-api";

export const dynamic = 'force-dynamic';

// YOUR NPSSO TOKEN
const NPSSO = "dKEEte64tE8lRFQFBm5MDWutKyFRsGezqpVJp3SuzGouaMDuEvjSb8xiSf4mjIG2";

export async function GET() {
  try {
    // 1. Authenticate with Sony
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authTokens = await exchangeAccessCodeForAuthTokens(accessCode);

    // 2. Fetch Data (Using the stable v2.3.2 names)
    const friendsResponse = await getFriendsList(authTokens, "me");
    const gamesResponse = await getUserTitles(authTokens, "me");
    const presenceResponse = await getBasicPresence(authTokens, "me");

    // 3. Return Data
    return NextResponse.json({
      profile: presenceResponse,
      friends: friendsResponse.friends || [],
      games: gamesResponse.trophyTitles || []
    });

  } catch (error: any) {
    console.error("PSN API Error:", error.message);
    return NextResponse.json(
      { error: "AUTH_FAILED", message: error.message }, 
      { status: 500 }
    );
  }
}
