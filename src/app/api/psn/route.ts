import { NextResponse } from "next/server";
import { exchangeNpssoForAccessCode, exchangeAccessCodeForAuthTokens, getFriendsList, getBasicPresence, getUserTitles } from "psn-api";
export const dynamic = 'force-dynamic';
const NPSSO = "dKEEte64tE8lRFQFBm5MDWutKyFRsGezqpVJp3SuzGouaMDuEvjSb8xiSf4mjIG2";
export async function GET() {
  try {
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authTokens = await exchangeAccessCodeForAuthTokens(accessCode);
    const friends = await getFriendsList(authTokens, "me");
    const games = await getUserTitles(authTokens, "me");
    const presence = await getBasicPresence(authTokens, "me");
    return NextResponse.json({ profile: presence, friends: friends.friends, games: games.trophyTitles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}