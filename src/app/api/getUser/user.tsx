import { getServerSession } from "next-auth";
import { authOptions } from "@/../../lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    console.log("get user Session récupérée :", session);

    if (!session) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 400 });
    }

    return NextResponse.json({ success: session }, { status: 200 });
}