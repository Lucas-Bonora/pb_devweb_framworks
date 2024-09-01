'use client'
import {getDocs, collection} from "firebase/firestore";
import {db, auth} from "@/config/firebase";
import {useEffect, useState} from "react";
import Link from "next/link";
import { signOut } from 'firebase/auth';

const AdminPage = () => {

    const [requiscaoList, setRequiscaoList] = useState(null);
    const [listaProdutos, setListaProdutos] = useState([]);
    const requisicaoRef = collection(db, "requisicao");

    const getRequiscao = async () => {
        const data = await getDocs(requisicaoRef);
        setRequiscaoList(data.docs.map((doc) =>
            ({...doc.data(), id: doc.id})));}

    const getProdutos = async () => {
        try {
            const produtosRef = collection(db, "produtos");
            const data = await getDocs(produtosRef);
            setListaProdutos(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };

    const getProdutoNome = (produtoId) => {
        const produto = listaProdutos.find(f => f.id === produtoId);
        return produto ? produto.nome : "Desconhecido";
    };

    useEffect(() => {
        getRequiscao();
        getProdutos();
    }, []);


    return (
        <main className="min-h-screen w-screen bg-bronzeBg text-bronzePrimaryText
        flex flex-col p-14">
            <h1 className="text-center text-3xl font-bold mb-7">
                Tela Administrador
            </h1>

            <div className="flex flex-row justify-start
             my-7 mx-14 gap-7
             w-fit
             bg-bronzeComponent rounded-md px-3.5 py-2">
                <Link href={`/admin/fornecedores`}
                    className="p-2 rounded
                    hover:bg-bronzeButtons
                ">
                    Fornecedores
                </Link>

                <Link href={`/admin/contatos`}
                    className="p-2 rounded
                    hover:bg-bronzeButtons
                ">
                    Contatos
                </Link>

                <Link href={`/admin/produtos`}
                      className="p-2 rounded
                    hover:bg-bronzeButtons
                ">
                    Produtos
                </Link>

                <button
                    className="p-2 rounded
                    hover:bg-bronzeBg
                ">
                    Usuários
                </button>

                <button
                    onClick={() => {
                        signOut(auth)
                        sessionStorage.removeItem('user')
                    }}
                    className="p-2 rounded
                    hover:bg-red-200"
                >
                    Log out
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-7 px-14">
                {requiscaoList?.map((requisicao, key) => (
                    <div key={key}
                         className="bg-bronzeComponent
                    border border-bronzeBorder p-3.5
                    shadow-lg shadow-bronzeBorder/80
                    flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <p className="border-b border-bronzePrimaryText pr-1.5 h-fit">
                                    Produto: {getProdutoNome(requisicao.produtoId)}
                            </p>
                            <div className="mt-2 flex flex-row w-full justify-around">
                                <p className="text-sm">
                                    Nome Usuário
                                </p>
                                <p className="text-sm">
                                    Status: {requisicao.status}
                                </p>
                            </div>
                        </div>

                        <Link href={`/admin/${requisicao.id}`}
                              className="bg-bronzeButtons border border-bronzePrimaryText
                                        p-1.5 rounded-md text-base my-3.5">
                            Cotar
                        </Link>
                    </div>
                ))}
            </div>
        </main>

    )
}

export default AdminPage;
