import { ORGANIZATION_TYPES } from "./gmail.organizations.js";

export const ORGANIZATION_RULES = {

    recruiter: {
        keywords: [
            "recruiter",
            "talent",
            "hiring",
            "career",
            "careers",
            "jobs",
            "workday",
            "greenhouse"
        ],
        score: 45
    },

    company: {
        keywords: [
            "zoho",
            "google",
            "amazon",
            "microsoft",
            "infosys",
            "tcs",
            "wipro",
            "accenture",
            "cognizant",
            "paypal",
            "oracle",
            "adobe",
            "intel",
            "ibm"
        ],
        score: 40
    },

    university: {
        keywords: [
            "college",
            "university",
            "campus",
            "placement",
            "sastra",
            "coursera",
            "edx",
            "udemy"
        ],
        score: 30
    },

    finance: {
        keywords: [
            "hdfc",
            "icici",
            "sbi",
            "bank",
            "paypal",
            "stripe"
        ],
        score: 35
    },

    government: {
        keywords: [
            "gov",
            "uidai",
            "passport",
            "income tax",
            "gst"
        ],
        score: 35
    },

    development: {
        keywords: [
            "github",
            "gitlab",
            "vercel",
            "netlify",
            "docker",
            "render"
        ],
        score: 20
    },

    social: {
        keywords: [
            "linkedin",
            "facebook",
            "instagram",
            "twitter",
            "x.com"
        ],
        score: 5
    },

    entertainment: {
        keywords: [
            "youtube",
            "spotify",
            "netflix",
            "prime video"
        ],
        score: 0
    }

};

class GmailOrganization {

    classify(domain) {

        for (const [type, words]of Object.entries(ORGANIZATION_TYPES)) {

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
    getScore(type) {

        return ORGANIZATION_RULES[type]?.score ?? 0;

    }

    isImportant(type) {

        return this.getScore(type) >= 30;

    }


}

export default new GmailOrganization();