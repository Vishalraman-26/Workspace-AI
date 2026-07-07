import * as authService from "./auth.service.js";

export async function register(req, res) {

    try {

        const { name, email, password } = req.body;

        const user = await authService.register(
            name,
            email,
            password
        );

        return res.json({

            success: true,

            data: user

        });

    }

    catch (err) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

export async function login(req, res) {

    try {

        const { email, password } = req.body;

        const session =
            await authService.login(
                email,
                password
            );

        return res.json({

            success: true,

            data: session

        });

    }

    catch (err) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

}