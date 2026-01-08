import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    let creds = await req.json();
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: creds.email,
      password: creds.password,
    });

    if (error) {
      return NextResponse.json({ error: "Signup error", errorMsg: error }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      message: "Check your email for the confirmation link",
      user: data.user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error:  `Internal Server Error ${err.message}` },
      { status: 500 }
    );
  }
};
