import { useState, useEffect, useContext } from "react"
import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiPlusCircle } from "react-icons/fi"

import { AuthContext } from "../../contexts/auth"
import { db } from "../../services/firebaseConection"
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom"

import './new.css'
//import { computeHeadingLevel } from "@testing-library/react"

import { toast } from "react-toastify"


//====================================================================

const listRef = collection(db, "customers")

export default function New(){

    const {user} = useContext(AuthContext)
    const { id } = useParams();
    const navigate = useNavigate()

    const [ customers, setCustumers ] = useState([])
    const [loadCustomer, setLoadCustumer] = useState(true)
    const [customerSelecionado, setCustumerSelecionado] = useState(0)
    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('');
    const [status, setStatus] = useState('');
    const [idCustumer, setIdCustumer] = useState(false)

//===================================================================
     
    useEffect(() => {
        async function loadCustomers(){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot)=>{
                let lista = []

                snapshot.forEach((doc) =>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(snapshot.docs.size === 0 ){
                    console.log("Nenhum cliente cadastrao!")
                    setCustumers([{id: 1, nomeFantasia: 'Freela'}])
                    setLoadCustumer(false)
                    return;
                }


                setCustumers(lista)
                setLoadCustumer(false)

                if(id){
                    loadId(lista)
                }

            })
            .catch((error)=>{
                console.log("Erro ao buscar clientes", error)
                setLoadCustumer(false)
                setCustumers([{id: 1, nomeFantasia: 'Freela'}])
            })
        }

        loadCustomers();
    }, [id])


    async function loadId(lista){
        const docRef = doc(db, "chamados", id);
        await getDoc(docRef)
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)


            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustumerSelecionado(index);
            setIdCustumer(true)
        })
        .catch((error) => {
            console.log(error)
            toast.error("Ops! algo de errado")
            setIdCustumer(false)
        })
    }


    function handleOptionChange(e){
        setStatus(e.target.value)
    }


    function handleChangeSelect(e){
        setAssunto(e.target.value)
    }


    function handleChangeCustomer(e){
        setCustumerSelecionado(e.target.value)
    }


    async function handleRegister(e){
        e.preventDefault();

        if(idCustumer){
            //Atualizando Chamado

            const docRef = doc(db, "chamados", id)
            await updateDoc(docRef, {
                cliente: customers[customerSelecionado].nomeFantasia,
                clienteId: customers[customerSelecionado].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid,
            })
            .then(() => {
                toast.info("Atualizado com Sucesso!")
                setCustumerSelecionado(0)
                setComplemento('')
                navigate('/dashboard')
            })
            .catch(() => {
                toast.error("Erro ao atualizar! verique...")
            })
            return;
        }

        await addDoc(collection(db, "chamados"), {
            created: new Date(),
            cliente: customers[customerSelecionado].nomeFantasia,
            clienteId: customers[customerSelecionado].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid,
        })
        .then(() => {
            toast.success(" Chamado Criado com Sucesso!")
            setComplemento('')
            setCustumerSelecionado(0)
        })
        .catch((error) => {
            toast.error("Ops! Algo errado")
            console.log(error)
        })

    }

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name={id ? "Editando chamado" : "Novo chamado"}>
                    <FiPlusCircle size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type="text" disabled={true} value="Carregando..."/>
                            ) : (
                                <select value={customerSelecionado} onChange={handleChangeCustomer}>
                                    {customers.map((item, index) => {
                                        return(
                                            <option key={index} value={index}>
                                                {item.nomeFantasia}
                                            </option>
                                        )
                                    })}
                                </select>
                            )



                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>                 
                        </select>

                        <label>Status</label>
                            <div className="status">
                               <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'}
                               /> 
                               <span>Em aberto</span>

                               <input
                                type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={handleOptionChange}
                                checked={status === 'Progresso'}
                               /> 
                               <span>Progresso</span>

                               <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={status === 'Atendido'}
                               /> 
                               <span>Atendido</span>
                            </div>

                            <label>Complemento</label>
                            <textarea
                                type="text"
                                placeholder="Descreva seu problema (opcional)"
                                value={complemento}
                                onChange={(e) => setComplemento(e.target.value)}
                            />

                            

                            <button type="submit">
                                {idCustumer ? "Atualiazar" : "Registrar"}
                                
                            </button>
                    </form>
                </div>
            </div>
            
        </div>
        
    )
}