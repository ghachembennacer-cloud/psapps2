import { NextResponse } from "next/server";
import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getFriendsListFirstParty, // Updated name
  getBasicPresence,           // Updated name
  getUserTitles
} from "psn-api";

export const dynamic = 'force-dynamic';

// Current NPSSO
const NPSSO = "dKEEte64tE8lRFQFBm5MDWutKyFRsGezqpVJp3SuzGouaMDuEvjSb8xiSf4mjIG2";

export async function GET() {
  try {
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authTokens = await exchangeAccessCodeForAuthTokens(accessCode);

    // Call the updated function names
    const friendsResponse = await getFriendsListFirstParty(authTokens, "me");
    const gamesResponse = await getUserTitles(authTokens, "me");
    const presenceResponse = await getBasicPresence(authTokens, "me");

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
