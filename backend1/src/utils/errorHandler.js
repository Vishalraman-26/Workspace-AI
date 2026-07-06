class ErrorHandler {

    format(error) {

        const msg = error.message.toLowerCase();

        if(msg.includes("calendar")){

            return "I couldn't access your calendar at the moment.";

        }

        if(msg.includes("gmail")){

            return "I couldn't access your Gmail account.";

        }

        if(msg.includes("rag")){

            return "I couldn't find anything relevant in your documents.";

        }

        if(msg.includes("timeout")){

            return "The request took too long. Please try again.";

        }

        return "Something went wrong. Please try again.";

    }

}

export default new ErrorHandler();