import { useState, useEffect } from 'react';

import { AuthContext } from '../../contexts/auth';
import { useContext } from 'react';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi';

import { collection, getDocs, orderBy, limit, startAfter, doc, query } from 'firebase/firestore'; 
import { db } from '../../services/firebaseConection';
import { Link } from 'react-router-dom';

import './dashboard.css';


import { format } from 'date-fns';
import Modal from '../../components/Modal';




//=========================================================================

const listRef = collection(db, "chamados")

export default function Dashboard(){
    const { logout } = useContext(AuthContext)

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [loadingMore, setLoadingMore] = useState(false);

    const [modal, setModal] = useState(false);
    const [detalhes, setDetalhes] = useState()




    useEffect(() => {
        async function loadChamados(){
            const q = query(listRef, orderBy('created', 'desc'), limit(5));

            const querySnapshot = await getDocs(q)
            setChamados([]);
            await updateState(querySnapshot)

            setLoading(false);



        }
        loadChamados();

        return () => {}
    }, [])


    async function updateState(querySnapshot){
        const isColletionEmpty = querySnapshot.size === 0;

        if(!isColletionEmpty){
            let lista = [];

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento,

                })
            })

            const lastDoc = querySnapshot.docs[querySnapshot.docs.length -1] // pegando ultimo item da lista

            setChamados(chamados => [...chamados, ...lista])

            setLastDocs(lastDoc)




        }else{
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }



    async function handleMore(){
        setLoadingMore(true)

        const q = query(listRef, orderBy('created', 'desc'),startAfter(lastDocs), limit(5));
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot);
    }


    function abrirModal(item){
        setModal(!modal)
        setDetalhes(item)
    }


    if(loading){
        return(
            <div>
                <Header/>
                <div className='content'>
                    <Title name="Tickets">
                        <FiMessageSquare size={25}/>
                    </Title>

                    <div className='container dashboard'>
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }




    return(
        <div>
            <Header/>
                <div className='content'>
                    <Title name="Tickets">
                        <FiMessageSquare size={25}/>
                    </Title>
                

            <>
                

                {chamados.length === 0 ? (
                    <div className='container dashboard'>
                        <span>Nenhum Chamado encontrado...</span>

                        <Link to="/new" className='new'>
                            <FiPlus color='#fff' size={25}/>
                            Novo Chamado
                        </Link>
                    </div>
                ): (
                    <>

                        <Link to="/new" className='new'>
                            <FiPlus color='#fff' size={25}/>
                            Novo Chamado
                        </Link>

                    <table>
                        <thead>
                            <tr>
                                <th scope='col'>Cliente</th>
                                <th scope='col'>Assunto</th>
                                <th scope='col'>Status</th>
                                <th scope='col'>Cadastrado em</th>
                                <th scope='col'>#</th>
                            </tr>
                        </thead>  
                        <tbody>
                            {chamados.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td data-label="Cliente">{item.cliente}</td>
                                        <td data-label="Assunto">{item.assunto}</td>
                                        <td data-label="Status">
                                            <span className='badge' style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' && item.status === 'Atendido'? '#8B0000' : '#999' }}>
                                                {item.status}
                                            </span>
                                            
                                        </td>
                                        <td data-label="Cadastrado">{item.createdFormat}</td>
                                        <td data-label="#">
                                                <button className='action' style={{backgroundColor:'#3583f6'}} onClick={() => abrirModal(item)}>
                                            <FiSearch color='#fff' size={17}/>
                                        </button>
                                        <Link to={`/new/${item.id}`} className='action' style={{backgroundColor:'#f6a935'}}>
                                            <FiEdit2 color='#fff' size={17}/>
                                        </Link>
                                        </td>
                                    </tr> 
                                )
                            })}
                           
                        </tbody>
                </table>

                {loadingMore && <h3>Carregando mais chamados...</h3> }
                {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais </button>}

                    </>
                )}

                
            </>
                </div> 

                {modal && (
                    <Modal
                        conteudo={detalhes}
                        close={() => setModal(!modal)}
                    
                    />

                )}


        </div>
    )
}