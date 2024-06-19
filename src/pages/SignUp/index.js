import { useState, useContext } from 'react';
import { Link} from 'react-router-dom';
import LOGOCNS from '../../assets/LOGOCNS.png';
import './signup.css';

import { AuthContext } from '../../contexts/auth';



export default function SignUp(){

    const [name, setName ] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const { signUp, loadingAuth } =useContext(AuthContext)

      
    
    async function handleSubmit(e){
        e.preventDefault();

        if(name !== '' && email !== '' && senha !== '' ){
            await signUp(email, senha, name);
            setEmail('')
            setSenha('')
            setName('')

                        
        }
    }


    return(
        <div className="container-center">
            <div className='login'>
            <div className='login-area'>
                <img src={LOGOCNS} alt='logo_do_sistema_chamados' />
            </div>

                <form onSubmit={handleSubmit}>
                    <h1>Nova conta</h1>

                    <input
                        type='text'
                        placeholder='Digite seu Nome'
                        value={name}
                        onChange={ (e) => setName(e.target.value) }
                    />

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

                        {loadingAuth ? 'Carregando...' : 'Cadastrar'}
                        
                    </button>

                </form>

                <Link to="/">
                    Já possui conta? Login.
                </Link>

            </div>
        </div>
    )
}