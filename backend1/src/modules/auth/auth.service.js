import supabase from "../../config/supabase.js";

export async function register(email, password) {

    const { data, error } =
        await supabase.auth.signUp({

            email,
            password

        });

    if (error) throw error;

    return data;
}

export async function login(email, password) {

    const { data, error } =
        await supabase.auth.signInWithPassword({

            email,
            password

        });

    if (error) throw error;

    return data;
}

export async function getUser(token) {

    const { data, error } =
        await supabase.auth.getUser(token);

    if (error) throw error;

    return data.user;
}