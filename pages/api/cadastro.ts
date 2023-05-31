import type { NextApiRequest , NextApiResponse } from "next";
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import {UsuarioModel} from '../../models/UsuarioModel'
import md5 from 'md5';
import {conectarMongoDB} from "../../middlewares/conectarMongoDB";

const endpointCadastro =
async (req : NextApiRequest , res : NextApiResponse<RespostaPadraoMsg>) => {
    
    if(req.method === 'POST'){
        const usuario = req.body as CadastroRequisicao;

        if(!usuario.nome || usuario.nome.length < 2){
            return res.status(400).json({erro : 'Nome inválido'})
        }

        if(!usuario.email || usuario.email.length < 5
        || !usuario.email.includes('@')
        || !usuario.email.includes('.')){
            return res.status(400).json({erro : 'Email inválido'});
        }

        if(!usuario.senha || usuario.senha.length < 4){
            return res.status(400).json({erro : 'Senha Inválida'})
        }

        // validação de duplicidade de usuário
        const UsuarioComMesmoEmail = await UsuarioModel.find({email : usuario.email});
        if(UsuarioComMesmoEmail && UsuarioComMesmoEmail.length > 0){
            return res.status(400).json({erro : 'Email já cadastrado'})
        }

        // salvar no banco de dados
        const UsuarioASerSalvo = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha)
        }
        await UsuarioModel.create(UsuarioASerSalvo);
        return res.status(200).json({msg: 'Usuário criado com sucesso'})
    }
    return res.status(405).json({erro : 'Método informado não é válido'});
}

export default conectarMongoDB(endpointCadastro);