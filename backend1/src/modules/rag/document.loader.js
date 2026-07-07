import fs from "fs/promises";
import path from "path";
import pdf from "pdf-parse-new";
import mammoth from "mammoth";
import pptx2json from "pptx2json";
class DocumentLoader {

    async load(filePath) {

        try {

            await fs.access(filePath);

            const extension = path.extname(filePath).toLowerCase();

            switch (extension) {

                case ".pdf":
                    return await this.loadPDF(filePath);

                case ".txt":
                    return await this.loadTXT(filePath);

                case ".docx":
                    return await this.loadDOCX(filePath);
                case ".pptx":
                    return await this.loadPPTX(filePath);
                default:
                    throw new Error(
                        `Unsupported document format: ${extension}`
                    );

            }

        }

        catch (error) {

            console.error("Document Loader Error:", error);

            throw error;

        }

    }

    async loadPDF(filePath) {

        try {

            const buffer = await fs.readFile(filePath);

            const data = await pdf(buffer);
            console.log("Pages:", data.numpages);


            if (!data.text?.trim()) {

                throw new Error(
                    "PDF contains no readable text. It may be scanned or corrupted."
                );

            }

            return {

                title: path.basename(filePath),

                text: data.text.trim()

            };

        }

        catch (error) {

            console.error("PDF Parsing Error:", error);

            throw new Error(
                `Unable to read PDF "${path.basename(filePath)}".`
            );

        }

    }

    async loadTXT(filePath) {

        try {

            const text = await fs.readFile(
                filePath,
                "utf8"
            );

            if (!text.trim()) {

                throw new Error(
                    "Text file is empty."
                );

            }

            return {

                title: path.basename(filePath),

                text: text.trim()

            };

        }

        catch (error) {

            console.error("TXT Loading Error:", error);

            throw new Error(
                `Unable to read TXT "${path.basename(filePath)}".`
            );

        }

    }

    async loadDOCX(filePath) {

        try {

            const result =
                await mammoth.extractRawText({

                    path: filePath

                });

            if (!result.value?.trim()) {

                throw new Error(
                    "DOCX contains no readable text."
                );

            }

            return {

                title: path.basename(filePath),

                text: result.value.trim()

            };

        }

        catch (error) {

            console.error("DOCX Loading Error:", error);

            throw new Error(
                `Unable to read DOCX "${path.basename(filePath)}".`
            );

        }

    }
    async loadPPTX(filePath) {

        try {
    
            const presentation = await pptx2json(filePath);
    
            let text = "";
    
            for (const slide of presentation.slides || []) {
    
                for (const shape of slide.shapes || []) {
    
                    if (shape.text) {
    
                        text += shape.text + "\n";
    
                    }
    
                }
    
                text += "\n";
    
            }
    
            if (!text.trim()) {
    
                throw new Error(
                    "PPTX contains no readable text."
                );
    
            }
    
            return {
    
                title: path.basename(filePath),
    
                text: text.trim()
    
            };
    
        }
    
        catch (error) {
    
            console.error("PPTX Loading Error:", error);
    
            throw new Error(
                `Unable to read PPTX "${path.basename(filePath)}".`
            );
    
        }
    
    }

}

export default new DocumentLoader();