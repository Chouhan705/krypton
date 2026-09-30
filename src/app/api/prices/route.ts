import { NextResponse } from "next/server";

export const revalidate = 30; // ISR cache in seconds

export async function GET() {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h";

    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch crypto prices from upstream provider" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error fetching rates" },
      { status: 500 }
    );
  }
}