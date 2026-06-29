import {
    IMPORTANT_SENDERS,
    LOW_PRIORITY_SENDERS
} from "./gmail.constants.js";

import { CATEGORY_RULES } from "./gmail.rules.js";
import GmailPriority from "./gmail.priority.js";
import GmailSender from "./gmail.sender.js";
import GmailOrganization from "./gmail.organization.js";

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

        const category = bestCategory;
        const sender = GmailSender.normalize(email.from);

        const organization = GmailOrganization.classify(sender.rootDomain);

        // ----------------------------------------
        // PRIORITY ENGINE
        // ----------------------------------------

        let priority = GmailPriority.calculate({

            ...email,

            category

        });

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

        const actionRequired = priority >= 70;

        return {

            ...email,

            sender,

            organization,

            category,

            priority,

            actionRequired

        };

    }

}

export default new GmailRanker();