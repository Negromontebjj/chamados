import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConection';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

//==================================================================

export const AuthContext = createContext({});

function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loading, setLoading ] = useState(true)

  const navigation = useNavigate();


  useEffect(() => {
    async function loadUser(){
      const storageUser = localStorage.getItem("@ticketsPRO")

      if( storageUser ){
        setUser(JSON.parse(storageUser))
        setLoading(false);
      }

      setLoading(false)


    }

    loadUser();
  }, [] )





  async function signIn(email, senha){
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, senha)
    .then(async(value) => {
      let uid = value.user.uid

      const docRef = doc(db, "users", uid)
      const docSnap = await getDoc(docRef)

      let data = {
        uid: uid,
        nome: docSnap.data().nome,
        email: value.user.email,
        avatarUrl: docSnap.data().avatarUrl
      }; 

      setUser(data);
      storageUser(data);
      setLoadingAuth(false)
      toast.success("Bem vindo(a) de volta!")
      navigation("/dashboard")
    })
    .catch((error) => {
      console.log(error)
      setLoadingAuth(false)
      toast.error("Ops! algo de Errado. Verifique email ou Senha, Por favor!")
    })

  }


  async function signUp(email, senha, name){
    setLoadingAuth(true)
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(async(value) => {
        let uid = value.user.uid

        await setDoc(doc(db, "users", uid), {
            nome: name,
            avatarUrl: null,
        })
        .then(() => {
            let data = {
                uid: uid,
                nome:name,
                email:value.user.email,
                avatarUrl:null
            };

            setUser(data)
            storageUser(data)
            setLoadingAuth(false)
            toast.success("Seja bem vindo(a) ao sistema!")
            navigation("/dashboard")
        })
    })
    .catch((error) => {
        console.log("Erro ao cadastrar" + error)
        setLoadingAuth(false)
    })
  }


  function storageUser(data){
    localStorage.setItem("@ticketsPRO", JSON.stringify(data))
  }


  async function logout(){
    await signOut(auth);
    localStorage.removeItem("@ticketsPRO");
    setUser(null)
  }


  return(
    <AuthContext.Provider 
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;