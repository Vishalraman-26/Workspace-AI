import supabase from "../config/supabase.js";

export async function authenticate(req, res, next) {
    //console.log("===== AUTH MIDDLEWARE =====");
    //console.log("Authorization:", req.headers.authorization);
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authorization header missing"

            });

        }

        const token = authHeader.replace("Bearer ", "");
        // console.log("Token:", token);
        const { data, error } = await supabase.auth.getUser(token);
        // console.log("User:", data?.user);
        // console.log("Error:", error);
        if (error || !data.user) {

            return res.status(401).json({

                success: false,

                message: "Invalid token"

            });

        }

        req.user = data.user;

        next();

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

}