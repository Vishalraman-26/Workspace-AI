export function success(data = null, message = "Success") {

    return {

        success: true,

        message,

        data

    };

}

export function failure(message = "Failed") {

    return {

        success: false,

        message

    };

}