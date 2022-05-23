import type {NextFetchEvent, NextRequest} from 'next/server'
import {checkUserAuthentication} from "../../api/CheckUserAuthentication.api";
import {NextResponse} from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const token = req.cookies?.auth || null;
    const URL = process.env.URL_CLIENT || 'http://localhost:3000';

    if (token) {
        const response = await checkUserAuthentication(token)
        if (response?.status === 200) {
            return NextResponse.redirect(URL)
        }
    }
    NextResponse.next();
}
