import type { NextApiRequest, NextApiResponse } from 'next';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import {UsuarioModel} from '../../models/UsuarioModel'
import { validarTokenJWT } from '@/middlewares/validarTokeJWT';
import { politicaCORS } from '@/middlewares/politicaCORS';

const pesquisaEndpoint
    = async (req : NextApiRequest , res: NextApiResponse<RespostaPadraoMsg | any[]>) =>{

    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id);
                if(!usuarioEncontrado){
                    return res.status(400).json({erro : 'Usuário não encontrado.'});
                }
                usuarioEncontrado.senha = null;
                return res.status(200).json(usuarioEncontrado);

            }else{
                const {filtro} = req.query;
            if(!filtro || filtro.length < 2){
                return res.status(400).json({erro : 'Favor informar mais caractéres para a busca.'})
            }

            const usariosEncontrados = await UsuarioModel.find({
                $or: [{nome : {$regex : filtro, $options : 'i'}}, 
                {email : {$regex : filtro, $options : 'i'}}] 
                
            });

            return res.status(200).json(usariosEncontrados);
            }
    
        }
        return res.status(405).json({erro : 'Método informado não é válido.'})

    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Não foi possível buscar usuário.'})
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(pesquisaEndpoint)));