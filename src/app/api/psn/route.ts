import { NextResponse } from "next/server";
import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getFriendsListFirstParty,
  getBasicPresence,
  getUserTitles
} from "psn-api";

export const dynamic = 'force-dynamic';

const NPSSO = "dKEEte64tE8lRFQFBm5MDWutKyFRsGezqpVJp3SuzGouaMDuEvjSb8xiSf4mjIG2";

export async function GET() {
  try {
    // 1. Authentication Flow
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authTokens = await exchangeAccessCodeForAuthTokens(accessCode);

    // 2. Parallel Data Fetching with Logic Wrappers
    // We fetch all three at once to save time (Complex Logic: Promise.allSettled)
    const [friendsRes, gamesRes, presenceRes] = await Promise.allSettled([
      getFriendsListFirstParty(authTokens, "me"),
      getUserTitles(authTokens, "me"),
      getBasicPresence(authTokens, "me")
    ]);

    // 3. Data Extraction (Logic: Ensure we never return 'null' to the frontend)
    const friends = friendsRes.status === 'fulfilled' ? friendsRes.value.friends : [];
    const games = gamesRes.status === 'fulfilled' ? gamesRes.value.trophyTitles : [];
    const profile = presenceRes.status === 'fulfilled' ? presenceRes.value : {};

    return NextResponse.json({
      success: true,
      data: {
        profile,
        friends: friends || [],
        games: games || []
      }
    });

  } catch (error: any) {
    console.error("Critical PSN API Failure:", error.message);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}
