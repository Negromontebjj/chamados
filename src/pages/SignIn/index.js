import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import './signin.css';

import LOGOCNS from '../../assets/LOGOCNS.png'

import {AuthContext} from '../../contexts/auth'

//========================================================================================


export default function SignIn(){

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const { signIn, loadingAuth } = useContext(AuthContext)


    async function handleSignIn(e){
        e.preventDefault();
        
        if(email !== '' && senha !== ''){
            await signIn(email, senha);
        }
    }


    return(
        <div className="container-center">
            <div className='login'>
            <div className='login-area'>
                <img src={LOGOCNS} alt='logo_do_sistema_chamados' />
            </div>

                <form onSubmit={handleSignIn}>
                    <h1>Entrar</h1>

                    <input
                        type='text'
                        placeholder='Digite seu e-mail'
                        value={email}
                        onChange={ (e) => setEmail(e.target.value) }
                    />

                    <input
                        type='password'
                        placeholder='*********************'
                        value={senha}
                        onChange={ (e) => setSenha(e.target.value) }
                    />

                    <button type='submit'>
                    
                        {loadingAuth ? "Carregando" : "Acessar"}
                    
                    </button>
                </form>

                <Link to="/cadastro">
                    Criar uma conta
                </Link>

            </div>
        </div>
    )
}