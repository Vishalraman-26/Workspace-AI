import { DatabaseError } from "./errors.js";

export default class BaseService {

    handleError(error) {

        console.error(error);

        throw new DatabaseError(error.message);

    }

}