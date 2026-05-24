import { createClient } from '@supabase/supabase-js';

// .env 파일에 적어둔 주소와 열쇠를 가져옵니다 (Vite 전용 방식)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 통신병(supabase) 생성!
export const supabase = createClient(supabaseUrl, supabaseAnonKey);