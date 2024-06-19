import { useContext } from 'react';
import avatarImg from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { FiHome, FiUser, FiSettings} from 'react-icons/fi';

import LOGOCNS from '../../assets/LOGOCNS.png'

import './header.css';

//=======================================================================


export default function Header(){
    const { user } = useContext(AuthContext);


    return(
        <div className='sidebar'>
            <div>
                <img 
                    src={user.avatarUrl === null ? avatarImg : user.avatarUrl} 
                    alt='Foto Usuario' />

                <Link to="/dashboard">
                    <FiHome color='#fff' size={22}/>
                    Chamados
                </Link>

                <Link to="/customers">
                    <FiUser color='#fff' size={22}/>
                    Clientes
                </Link>

                <Link to="/profile">
                    <FiSettings color='#fff' size={22}/>
                    Perfil
                </Link>

            

            </div>

            
        </div>
    )
}