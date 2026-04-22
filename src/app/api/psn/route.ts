import { NextResponse } from "next/server";
import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getFriendsList, // We will try the standard export again
  getBasicPresence,
  getUserTitles
} from "psn-api";

export const dynamic = 'force-dynamic';
const NPSSO = "dKEEte64tE8lRFQFBm5MDWutKyFRsGezqpVJp3SuzGouaMDuEvjSb8xiSf4mjIG2";

export async function GET() {
  try {
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authTokens = await exchangeAccessCodeForAuthTokens(accessCode);

    // Using a try-catch specifically for friends so the whole app doesn't crash 
    // if Sony changes the friend-list name again.
    let friends = [];
    try {
      const friendsResponse = await getFriendsList(authTokens, "me");
      friends = friendsResponse.friends;
    } catch (e) {
      console.error("Friends fetch failed, check psn-api version:", e);
    }

    const gamesResponse = await getUserTitles(authTokens, "me");
    const presenceResponse = await getBasicPresence(authTokens, "me");

    return NextResponse.json({
      profile: presenceResponse,
      friends: friends,
      games: gamesResponse.trophyTitles
    });
  } catch (error: any) {
    return NextResponse.json({ error: "PSN_AUTH_ERROR", message: error.message }, { status: 500 });
  }
}
