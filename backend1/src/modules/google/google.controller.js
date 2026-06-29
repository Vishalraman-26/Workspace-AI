import GoogleService from "./google.service.js";
import GmailService from "./gmail.service.js";
class GoogleController {
    async connect(req, res) {
        const url = await GoogleService.getAuthUrl(req.user.id);
        res.redirect(url);
    }

    async callback(req, res) {
    const { code, state } = req.query;
    const result = await GoogleService.handleCallback(
        code,
        state
    );
    res.json(result);
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