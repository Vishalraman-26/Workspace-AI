import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

class Chunker {

    constructor() {

        this.splitter = new RecursiveCharacterTextSplitter({

            chunkSize: 1000,

            chunkOverlap: 200,

            separators: [

                "\n\n",

                "\n",

                ". ",

                " ",

                ""

            ]

        });

    }

    async chunk(text) {

        if (!text?.trim()) {

            return [];

        }

        const documents =
            await this.splitter.createDocuments([text]);

        return documents.map((doc, index) => ({

            index,

            text: doc.pageContent

        }));

    }

}

export default new Chunker();