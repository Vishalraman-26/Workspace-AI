class Chunker {

    chunk(text, options = {}) {

        const chunkSize = options.chunkSize ?? 1200;
        const overlap = options.overlap ?? 200;

        const chunks = [];

        let start = 0;

        while (start < text.length) {

            let end = start + chunkSize;

            if (end < text.length) {

                const lastPeriod = text.lastIndexOf(".", end);

                if (lastPeriod > start) {

                    end = lastPeriod + 1;

                }

            }

            chunks.push({

                index: chunks.length,

                text: text.slice(start, end).trim()

            });

            start = end - overlap;

        }

        return chunks;

    }

}

export default new Chunker();