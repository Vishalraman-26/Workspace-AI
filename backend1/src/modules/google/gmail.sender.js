class GmailSender {

    normalize(from = "") {

        const lower = from.toLowerCase();

        const emailMatch = lower.match(/<(.+?)>/);

        const email = emailMatch
            ? emailMatch[1]
            : lower;

        const domain = email.split("@")[1] || "";

        const rootDomain = domain
            .split(".")
            .slice(-2)
            .join(".");

        return {raw: from,email,domain,rootDomain};

    }

}

export default new GmailSender();