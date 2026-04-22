import { NextResponse } from "next/server";
import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getFriendsListFirstParty, // <--- Name changed here
  getBasicPresence,
  getUserTitles
} from "psn-api";

export const dynamic = 'force-dynamic';
const NPSSO = "dKEEte64tE8lRFQFBm5MDWutKyFRsGezqpVJp3SuzGouaMDuEvjSb8xiSf4mjIG2";

export async function GET() {
  try {
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authTokens = await exchangeAccessCodeForAuthTokens(accessCode);

    // Update the function call here as well
    const friendsResponse = await getFriendsListFirstParty(authTokens, "me");
    const gamesResponse = await getUserTitles(authTokens, "me");
    const presenceResponse = await getBasicPresence(authTokens, "me");

    return NextResponse.json({
      profile: presenceResponse,
      friends: friendsResponse.friends,
      games: gamesResponse.trophyTitles
    });
  } catch (error: any) {
    console.error("PSN API Error:", error);
    return NextResponse.json({ error: "PSN_AUTH_ERROR", message: error.message }, { status: 500 });
  }
}
