import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import {logOut} from './actions'
export default async function SessionHeader() {
 const supabase=await createClient()
 const {data:{user},error}=await supabase.auth.getUser()
 if(error||!user)redirect('/login')
 return <div className="account"><div><p className="eyebrow mb-1">Logged in as</p><p className="account-email">{user.email}</p></div><form action={logOut}><button className="button button-secondary">Log out</button></form></div>
}
