import { NextResponse } from 'next/server';
import { supabase } from '@/app/supabase';

export async function GET() {
    const { data: depts, error: deptsErr } = await supabase.from('departments').select('*');
    const { data: invs, error: invsErr } = await supabase.from('crew_invitations').select('*');
    return NextResponse.json({ depts, deptsErr, invs, invsErr });
}
