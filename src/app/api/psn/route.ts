import { NextResponse } from "next/server";
import * as PSN from "psn-api";

export const dynamic = 'force-dynamic';
const NPSSO = "dKEEte64tE8lRFQFBm5MDWutKyFRsGezqpVJp3SuzGouaMDuEvjSb8xiSf4mjIG2";

export async function GET() {
  try {
    const accessCode = await PSN.exchangeNpssoForAccessCode(NPSSO);
    const authTokens = await PSN.exchangeAccessCodeForAuthTokens(accessCode);

    const friendsResponse = await PSN.getFriendsList(authTokens, "me");
    const gamesResponse = await PSN.getUserTitles(authTokens, "me");
    const presenceResponse = await PSN.getBasicPresence(authTokens, "me");

    return NextResponse.json({
      profile: presenceResponse,
      friends: friendsResponse.friends || [],
      games: gamesResponse.trophyTitles || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: "PSN_ERROR", message: error.message }, { status: 500 });
  }
}
