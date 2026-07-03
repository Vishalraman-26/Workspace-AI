import {
    IMPORTANT_SENDERS,
    LOW_PRIORITY_SENDERS
} from "./gmail.constants.js";

import { CATEGORY_RULES } from "./gmail.rules.js";
import GmailPriority from "./gmail.priority.js";
import GmailSender from "./gmail.sender.js";
import GmailOrganization from "./gmail.organization.js";

const HIGH_VALUE_SUBJECTS = [
    "interview",
    "technical interview",
    "hr interview",
    "interview invitation",
    "shortlisted",
    "selected",
    "offer letter",
    "assessment",
    "coding test",
    "online test",
    "exam",
    "deadline",
    "last date",
    "meeting",
    "calendar invite",
    "google meet",
    "zoom",
    "verification",
    "verify",
    "verification code",
    "password reset",
    "new sign-in",
    "security alert",
    "oauth",
    "authentication",
    "payment due",
    "invoice",
    "receipt"
];

const LOW_VALUE_SUBJECTS = [
    "weekly digest",
    "monthly digest",
    "newsletter",
    "people you may know",
    "suggested",
    "recommended",
    "liked your post",
    "commented on",
    "shared a post",
    "viewed your profile",
    "new follower",
    "promotion",
    "sale",
    "discount",
    "offer inside",
    "cashback",
    "trending",
    "top stories",
    "what's new",
    "release notes"
];

class GmailRanker {

    rank(email) {

        const text = (
            email.subject +
            " " +
            email.snippet
        ).toLowerCase();

        // ----------------------------------------
        // CATEGORY DETECTION
        // ----------------------------------------

        let bestCategory = "general";
        let bestScore = 0;

        for (const [category, rule] of Object.entries(CATEGORY_RULES)) {

            let score = 0;

            for (const keyword of rule.keywords) {

                if (text.includes(keyword.toLowerCase())) {

                    score += rule.score;

                }

            }

            if (score > bestScore) {

                bestScore = score;
                bestCategory = category;

            }

        }
        const sender = GmailSender.normalize(email.from);
        const organization = GmailOrganization.classify(sender.rootDomain);
        if (
            bestCategory === "interview" &&
            ["social", "entertainment"].includes(organization)
        ) {
            bestCategory = "general";
        }
        const category = bestCategory;



        // ----------------------------------------
        // PRIORITY ENGINE
        // ----------------------------------------

        let priority = GmailPriority.calculate({

            ...email,

            category

        });
        // ----------------------------------------
        // SUBJECT SCORING
        // ----------------------------------------

        for (const keyword of HIGH_VALUE_SUBJECTS) {

            if (text.includes(keyword)) {

                priority += 20;

            }

        }

        for (const keyword of LOW_VALUE_SUBJECTS) {

            if (text.includes(keyword)) {

                priority -= 30;

            }

        }
        priority += GmailOrganization.getScore(organization);
        // ----------------------------------------
        // IMPORTANT SENDERS BOOST
        // ----------------------------------------

        for (const domains of Object.values(IMPORTANT_SENDERS)) {

            if (
                domains.some(domain =>
                    email.from.toLowerCase().includes(domain.toLowerCase())
                )
            ) {

                priority += 10;
                break;

            }

        }

        // ----------------------------------------
        // LOW PRIORITY SENDERS
        // ----------------------------------------

        if (

            LOW_PRIORITY_SENDERS.some(domain =>

                email.from.toLowerCase().includes(domain.toLowerCase())

            )

        ) {

            priority -= 20;

        }
        
        priority = Math.max(0, Math.min(priority, 100));

        // ----------------------------------------
        // ACTION REQUIRED
        // ----------------------------------------

        const ACTION_KEYWORDS = [
            "verify",
            "verification",
            "confirm",
            "complete",
            "join",
            "schedule",
            "respond",
            "accept",
            "submit",
            "expires",
            "deadline",
            "payment due",
            "interview",
            "assessment",
            "security alert",
            "new sign-in"
        ];

        const actionRequired =

            priority >= 75 ||

            ACTION_KEYWORDS.some(keyword =>
                text.includes(keyword)
            );
        const aiRelevant = (

            priority >= 60 ||

            actionRequired ||

            [
                "interview",
                "meeting",
                "deadline",
                "exam",
                "security",
                "payment",
                "finance",
                "project"
            ].includes(category)

        );
        //console.log("========== CATEGORY ==========");
        //console.log({subject: email.subject,category,priority,organization});
        return {

            ...email,

            sender,

            organization,

            category,

            priority,

            actionRequired,

            aiRelevant

        };

    }

}

export default new GmailRanker();