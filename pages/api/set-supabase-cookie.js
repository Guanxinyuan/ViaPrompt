import { supabaseClient } from "@/lib/supabase"

const handler = async (req, res) => {
    await supabaseClient.auth.api.setAuthCookie(req, res)
}

export default handler