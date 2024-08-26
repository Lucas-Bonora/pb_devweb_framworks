"use client"
import {useEffect, useState} from "react";
import {collection, query, where, getDoc, doc, getDocs } from "firebase/firestore";
import {db} from "@/config/firebase";
import Link from "next/link";

const ProductPage = ({params: {id}}) => {
    const [product, setProduct] = useState(null);
    const [fornecedores, setFornecedores] = useState([]);
    const [cotacoes, setCotacoes] = useState([])
    const productRef = doc(db, "Produtos", id);
    const fornecedoresRef = collection(db, "Produtos", id, "fornecedores");

    const getProduct = async () => {
        const data = await getDoc(productRef);

        if (data.exists()) {
            setProduct(data.data());
            console.log("Document data:", data.data());
        } else {
            console.log("No such document!");
        }
    };

    const getFornecedores = async () => {
        const data = await getDocs(fornecedoresRef);
        const fornecedores = [];

        data.forEach((doc) => {
            fornecedores.push({ id: doc.id, ...doc.data() });
        });
        console.log(fornecedores)


        return fornecedores;
    };

    const getCotacoes = async(fornecedorId) => { // Added fornecedorId parameter
        const cotacoesRef = collection(db, "Produtos", id, "fornecedores", fornecedorId, "cotacoes");
        const data = await getDocs(cotacoesRef);
        const cotacoes = [];

        data.forEach((doc) => {
            cotacoes.push({id: doc.id, ...doc.data() });
        })
        console.log(cotacoes)


        return cotacoes;
    };


    useEffect(() => {
        getProduct();
        getFornecedores().then((data) => {
            setFornecedores(data);
            data.forEach(async (fornecedor) => {
                const cotacoesForFornecedor = await getCotacoes(fornecedor.id);
                setCotacoes((prevCotacoes) => ({
                    ...prevCotacoes,
                    [fornecedor.id]: cotacoesForFornecedor
                }));
            });
        });
    }, []);

    return (
        <div
            className="bg-bronzeBg text-bronzePrimaryText
            h-screen w-screen p-14"
        >
            {product ? (

                    <div>
                        <p className="border-b border-bronzeBorder px-2
                        text-2xl
                        w-fit">
                            {product.nome}
                        </p>

                        <button className="bg-bronzeButtons border border-bronzePrimaryText rounded-md
                        p-1.5 mt-7">
                            Adicionar Fornecedor
                        </button>

                        <button className="bg-bronzeBg border border-bronzeSecondaryText
                                        p-1.5 rounded-md mx-7">
                            Editar Produto
                        </button>

                        <Link href={`/product-feed`}
                              className="border-b border-bronzePrimaryText pr-1.5 h-fit">
                            Voltar ao feed
                        </Link>

                    <div className="bg-bronzeComponent my-7 w-2/3
                    rounded-md pb-5
                    border border-bronzeBorder">
                            {fornecedores.map((fornecedor) => (
                                <div key={fornecedor.id}
                                     className="flex flex-row justify-around
                                     border-b border-bronzePrimaryText
                                     py-3.5 text-lg"
                                >
                                   <div>
                                       <p>
                                           {fornecedor.nome}
                                       </p>
                                       <p className="text-sm mt-5">
                                          Cep: {fornecedor.cep}
                                       </p>
                                       <button className="text-xs border-b border-bronzeBorder">
                                           Endereço completo
                                       </button>
                                   </div>

                                    <div>
                                        <p className="mb-5">
                                            Requisições de compras:
                                        </p>

                                        {cotacoes[fornecedor.id]?.map((cotacao) => (
                                            <div key={cotacao.id}
                                            className="text-base mb-5
                                            border border-bronzeBorder
                                            rounded p-2">
                                                <div className="flex flex-row justify-between mb-2">
                                                    <p className="">
                                                        Cotação
                                                    </p>
                                                    <p className="text-sm bg-bronzeBg p-1 rounded">
                                                        Status:
                                                    </p>
                                                </div>
                                                <p className="mb-1 text-sm">
                                                    Preço: R${cotacao.valor}
                                                </p>
                                                <p className="text-sm mb-1">
                                                    Fonte: {cotacao.fonte}
                                                </p>
                                                <p className="text-sm">
                                                    Data:
                                                </p>
                                            </div>
                                        ))}

                                    </div>

                                    <p>
                                        Contato: {fornecedor.contato}
                                    </p>
                                    <div className="flex flex-col">

                                        <button className="bg-bronzeButtons border border-bronzePrimaryText
                                        p-1.5 rounded-md text-sm">
                                            Cotar
                                        </button>

                                        <button className="bg-red-200 border border-red-800
                                        p-1.5 rounded-md text-sm my-3.5">
                                            Remover
                                        </button>

                                        <button className="bg-bronzeBg border border-bronzeSecondaryText
                                        p-1.5 rounded-md text-sm">
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            ) : (
                <p>Carregando...</p>
            )}


        </div>
    );


};

export default ProductPage

