import { NextResponse } from "next/server";
import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getFriendsList,
  getBasicPresence, // Fixed name
  getUserTitles
} from "psn-api";

export const dynamic = 'force-dynamic';

const NPSSO = "dKEEte64tE8lRFQFBm5MDWutKyFRsGezqpVJp3SuzGouaMDuEvjSb8xiSf4mjIG2";

export async function GET() {
  try {
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authTokens = await exchangeAccessCodeForAuthTokens(accessCode);

    const friendsResponse = await getFriendsList(authTokens, "me");
    const gamesResponse = await getUserTitles(authTokens, "me");
    const presenceResponse = await getBasicPresence(authTokens, "me"); // Fixed call

    return NextResponse.json({
      profile: presenceResponse,
      friends: friendsResponse.friends || [],
      games: gamesResponse.trophyTitles || []
    });
  } catch (error: any) {
    console.error("PSN API Error:", error.message);
    return NextResponse.json({ error: "AUTH_FAILED", message: error.message }, { status: 500 });
  }
}
