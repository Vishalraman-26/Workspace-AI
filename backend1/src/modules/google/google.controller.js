import GoogleService from "./google.service.js";
import GmailService from "./gmail.service.js";

class GoogleController {
    async connect(req, res) {
        const url = await GoogleService.getAuthUrl(req.user.id);
        res.redirect(url);
    }

    async callback(req, res) {
        try {
            const { code, state } = req.query;
    
            const result = await GoogleService.handleCallback(
                code,
                state
            );
    
            res.redirect("http://localhost:5173/dashboard");
    
        } catch (err) {
            console.error("GOOGLE CALLBACK ERROR:");
            console.error(err);
    
            res.status(500).json({
                success: false,
                message: err.message,
                error: err
            });
        }
    }

    async fetchInbox(req, res) {
        try {
            const emails = await GmailService.fetchInbox(req.user.id);
            res.json(emails);
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
    async summarizeInbox(req,res){
        const summary = await GoogleService.summarizeInbox(req.user.id);
        res.json({success:true,summary});
    }
    
}
export default new GoogleController();