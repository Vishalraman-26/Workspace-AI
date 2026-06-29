import { ORGANIZATION_TYPES } from "./gmail.organizations.js";

class GmailOrganization {

    classify(domain) {

        for (

            const [type, words]

            of Object.entries(ORGANIZATION_TYPES)

        ) {

            for (

                const word of words

            ) {

                if (

                    domain.includes(word)

                ) {

                    return type;

                }

            }

        }

        return "unknown";

    }

}

export default new GmailOrganization();