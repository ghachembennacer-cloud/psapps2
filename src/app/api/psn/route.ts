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

    // 2. Fetch Data with Failsafes
    // We fetch them separately so if one fails, the others still work
    const [friendsRes, gamesRes, presenceRes] = await Promise.allSettled([
      getFriendsList(authTokens, "me"),
      getUserTitles(authTokens, "me"),
      getBasicPresence(authTokens, "me")
    ]);

    const friends = friendsRes.status === 'fulfilled' ? friendsRes.value.friends : [];
    const games = gamesRes.status === 'fulfilled' ? gamesRes.value.trophyTitles : [];
    const profile = presenceRes.status === 'fulfilled' ? presenceRes.value : null;

    // 3. Return Clean Data
    return NextResponse.json({
      profile: profile,
      friends: friends || [],
      games: games || []
    });

  } catch (error: any) {
    console.error("PSN API Error:", error.message);
    return NextResponse.json(
      { error: "AUTH_FAILED", message: error.message }, 
      { status: 500 }
    );
  }
}
