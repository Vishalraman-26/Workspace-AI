import fs from "fs/promises";
import path from "path";
import pdf from "pdf-parse-new";
import mammoth from "mammoth";

class DocumentLoader {

    async load(filePath) {

        const extension =path.extname(filePath).toLowerCase();

        switch (extension) {

            case ".pdf":
                return this.loadPDF(filePath);

            case ".txt":
                return this.loadTXT(filePath);

            case ".docx":
                return this.loadDOCX(filePath);

            default:
                throw new Error(
                    "Unsupported document format."
                );

        }

    }

    async loadPDF(filePath) {

        const buffer =
            await fs.readFile(filePath);

        const data =
            await pdf(buffer);

        return {

            title: path.basename(filePath),

            text: data.text

        };

    }

    async loadTXT(filePath) {

        const text =
            await fs.readFile(
                filePath,
                "utf8"
            );

        return {

            title: path.basename(filePath),

            text

        };

    }

    async loadDOCX(filePath) {

        const result =
            await mammoth.extractRawText({

                path: filePath

            });

        return {

            title: path.basename(filePath),

            text: result.value

        };

    }

}

export default new DocumentLoader();