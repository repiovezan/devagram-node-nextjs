import type { NextApiRequest, NextApiResponse } from 'next';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import {UsuarioModel} from '../../models/UsuarioModel'
import { validarTokenJWT } from '@/middlewares/validarTokeJWT';
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { politicaCORS } from '@/middlewares/politicaCORS';

const likeEndpoint
    = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) =>{

        try {
            if(req.method === 'PUT'){

                // id da publicacao 
                const {id} = req?.query;
                const publicacao = await PublicacaoModel.findById(id);
                if(!publicacao){
                    return res.status(400).json({erro: 'Publicação não encontrada.'})
                }

                // id do usuario que esta curtindo a publicacao
                const {userId} = req?.query;
                const usuario = await UsuarioModel.findById(userId);
                if(!usuario){
                    return res.status(400).json({erro: 'Usuário não encontrado.'})
                }

                // como vamos administrar os likes?
                const indexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());

                // se o index for > -1 sinal q ele ja curte a foto
                if(indexDoUsuarioNoLike != -1){
                    publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                    await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                    return res.status(200).json({msg : 'Publicacao descurtida com sucesso'});
                }else {
                    // se o index for -1 sinal q ele nao curte a foto
                    publicacao.likes.push(usuario._id);
                    await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                    return res.status(200).json({msg : 'Publicacao curtida com sucesso'});
                }
            }
            return res.status(500).json({erro: 'Método informado não é válido.'})

        }catch(e){
            console.log(e);
            return res.status(500).json({erro: 'Ocorreu erro ao curtir publicação.'})
        }
    }

export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)));