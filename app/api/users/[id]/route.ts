"use server";
import { NextResponse } from "next/server";

interface UserContext {
    params: {
        id: string
    }
}

export const GET = async (_request: Request, context: UserContext)=>{
    const { id } = context.params;
    return NextResponse.json({id: id}, {status: 200})
}