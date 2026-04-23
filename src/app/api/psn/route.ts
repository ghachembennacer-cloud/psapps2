import { NextResponse } from "next/server";
import {
  exchangeNpssoForAccessCode,
  exchangeAccessCodeForAuthTokens,
  getFriendsListFirstParty as getFriendsList, // Alias for Turbopack
  getBasicPresence as getUserPresence,       // Alias for Turbopack
  getUserTitles
} from "psn-api";

export const dynamic = 'force-dynamic';
const NPSSO = "dKEEte64tE8lRFQFBm5MDWutKyFRsGezqpVJp3SuzGouaMDuEvjSb8xiSf4mjIG2";

export async function GET() {
  try {
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authTokens = await exchangeAccessCodeForAuthTokens(accessCode);

    // Fetch everything in parallel for maximum speed
    const [friendsData, gamesData, profileData] = await Promise.all([
      getFriendsList(authTokens, "me"),
      getUserTitles(authTokens, "me"),
      getUserPresence(authTokens, "me")
    ]);

    return NextResponse.json({
      success: true,
      profile: profileData,
      friends: friendsData.friends || [],
      games: gamesData.trophyTitles || []
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
