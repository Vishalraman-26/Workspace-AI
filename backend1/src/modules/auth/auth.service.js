import supabase from "../../config/supabase.js";

export async function register(name, email, password) {

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) throw error;

    const { error: accountError } = await supabase
        .from("google_accounts")
        .insert({
            user_id: data.user.id,
            name,
            email
        });

    if (accountError) throw accountError;

    return data;
}
export async function login(email, password) {

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password
        });

    if (error) throw error;

    const { data: profile, error: profileError } =
        await supabase
            .from("google_accounts")
            .select("user_id,name,email")
            .eq("user_id", data.user.id)
            .single();

    if (profileError) throw profileError;

    return {
        session: data.session,
        user: profile
    };
}
export async function getUser(token) {

    const { data, error } =
        await supabase.auth.getUser(token);

    if (error) throw error;

    return data.user;
}