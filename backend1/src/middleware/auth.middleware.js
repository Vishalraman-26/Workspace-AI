import supabase from "../config/supabase.js";

export async function authenticate(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authorization header missing"

            });

        }

        const token = authHeader.replace("Bearer ", "");

        const { data, error } = await supabase.auth.getUser(token);

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