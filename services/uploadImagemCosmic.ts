import { createBucketClient } from '@cosmicjs/sdk';
import multer from 'multer';

const {
    BUCKET_SLUG,
    BUCKET_WRITEKEY} = process.env;

const cosmic = createBucketClient({
    bucketSlug:BUCKET_SLUG,
    writeKey:BUCKET_WRITEKEY
})

const storage = multer.memoryStorage();
const updload = multer({storage : storage});

const uploadImagemCosmic = async(req : any) => {
    if(req?.file?.originalname){

        if(!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') && 
            !req.file.originalname.includes('.jpeg')){
                throw new Error('Extensao da imagem invalida');
        } 

        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };

        let folder = "AVATARES"
        if(req.url && req.url.includes('publicacao')){
            folder = "PUBLICACAO"
        }
        console.log(media_object)
        return await cosmic.media.insertOne({
            media: media_object,
            folder: folder
        })
    }
}

export {updload, uploadImagemCosmic};