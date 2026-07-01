import CalendarService from "./calendar.service.js";

export async function test(req, res, next) {

    try {

        const result = await CalendarService.test(

            req.user.id

        );

        res.json(result);

    }

    catch (error) {

        next(error);

    }

}

export async function createMeeting(req, res, next) {

    try {

        const result = await CalendarService.scheduleMeeting(

            req.user.id,

            req.body

        );

        res.json(result);

    }

    catch (error) {

        next(error);

    }

}

export async function updateMeeting(req, res, next) {

    try {

        const result = await CalendarService.updateMeeting(

            req.user.id,

            req.body

        );

        res.json(result);

    }

    catch (error) {

        next(error);

    }

}

export async function deleteMeeting(req, res, next) {

    try {

        const result = await CalendarService.deleteMeeting(

            req.user.id,

            req.body

        );

        res.json(result);

    }

    catch (error) {

        next(error);

    }

}