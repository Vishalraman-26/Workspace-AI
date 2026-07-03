const CATEGORY_PRIORITY = {

    interview: 60,

    meeting: 55,

    exam: 55,

    deadline: 55,

    payment: 50,

    security: 50,

    travel: 45,

    customer: 45,

    healthcare: 45,

    finance: 40,

    project: 40,

    education: 35,

    shopping: 25,

    social: 20,

    newsletter: 10,

    promotion: 5,

    general: 15

};
const NEGATIVE_INTERVIEW = [

"share their thoughts",

"liked your post",

"viewed your profile",

"weekly digest",

"newsletter",

"people you may know"

];


class GmailPriority {

    calculate(email) {

        let score = CATEGORY_PRIORITY[email.category] ?? 15;
                // --------------------
        // UNREAD
        // --------------------

        if(email.unread){

            score += 10;

        }

        // --------------------
        // STARRED
        // --------------------

        if(email.starred){

            score += 20;

        }

        // --------------------
        // IMPORTANT LABEL
        // --------------------

        if(email.important){

            score += 15;

        }

        // --------------------
        // ATTACHMENT
        // --------------------

        if(email.hasAttachment){

            score += 10;

        }
                const text = (

            email.subject +

            " " +

            email.snippet

        ).toLowerCase();

        if(

            text.includes("today") ||

            text.includes("immediately") ||

            text.includes("urgent")

        ){

            score += 20;

        }

        if(

            text.includes("tomorrow")

        ){

            score += 10;

        }
        if (email.category === "security") score += 20;

        if (email.category === "interview") score += 20;

        if (email.category === "exam") score += 15;

        if (email.category === "meeting") score += 15;

        if (email.category === "deadline") score += 20;

        if (email.category === "hackathon") score += 10;
        if(NEGATIVE_INTERVIEW.some(k=>text.includes(k))){
            score -= 100;
        }
        score = Math.min(score,100);

        return score;

    }

}

export default new GmailPriority();