import RAGService from "./rag.service.js";

export async function upload(req,res){
    console.log(req.file);
    console.log(req.body);
    const result=
        await RAGService.indexDocument(

            req.user.id,
            req.user.email,
            req.file.path,
            {
                source: "manual",
                documentType: "document",
                filename: req.file.originalname,
                uploadedAt: new Date().toISOString()
            }
        

        );

    res.json(result);

}

export async function ask(req,res){

    const result=

        await RAGService.answer(

            req.user.id,

            req.body

        );

    res.json({

        answer:result

    });

}