import supabase from "../../config/supabase.js";

class AttachmentDatabase {

    async exists(attachmentId) {

        const { data } = await supabase

            .from("indexed_attachments")

            .select("gmail_attachment_id")

            .eq("gmail_attachment_id", attachmentId)

            .maybeSingle();

        return !!data;

    }

    async save(attachment) {

        const { error } = await supabase

            .from("indexed_attachments")

            .insert({

                gmail_attachment_id: attachment.id,

                gmail_message_id: attachment.messageId,

                filename: attachment.filename

            });

        if (error) throw error;

    }

}

export default new AttachmentDatabase();