import {NextResponse,type NextRequest} from 'next/server'
import {cookies} from 'next/headers'
import {createClient} from '@/lib/supabase/server'
export async function POST(request:NextRequest) {
 if(request.headers.get('origin')!==request.nextUrl.origin) return new NextResponse('Forbidden',{status:403})
 const supabase=await createClient()
 await supabase.auth.signOut({scope:'local'})
 const store=await cookies()
 for(const cookie of store.getAll()) if(/^sb-.*-auth-token/.test(cookie.name)) store.set(cookie.name,'',{path:'/',maxAge:0})
 return NextResponse.redirect(new URL('/login?session=expired',request.url),303)
}
