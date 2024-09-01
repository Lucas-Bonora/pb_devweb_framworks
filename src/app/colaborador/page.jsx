'use client'

import {useEffect, useState} from "react";
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import {db} from "@/config/firebase";

const ColaboradorPage = () => {
    const [listaProdutos, setListaProdutos] = useState([]);
    const [listaRequisicao, setListaRequisicao] = useState([]);
    const [produtoId, setProdutoId] = useState("");
    const [quantidade, setQuantidade] = useState(0);
    const [descricao, setDescricao] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const requisicaoRef = collection(db, "requisicao")



    const getProdutos = async () => {
        try {
            const produtosRef = collection(db, "produtos");
            const data = await getDocs(produtosRef);
            setListaProdutos(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };

    const handleSave = async () => {
        if (!produtoId|| !quantidade|| !descricao) {
            alert("Preencha todos os campos.");
            return;
        }

        setLoading(true)

        try {
            if (isEditing && currentId) {
                const requisicaoDoc = doc(db, "requisicao", currentId);
                await updateDoc(requisicaoDoc, {
                    produtoId: produtoId,
                    quantidade: quantidade,
                    descricao: descricao,
                    status: "Aberta",
                });
                alert("Requisição atualizada com sucesso!");
            } else {
                await addDoc(requisicaoRef, {
                    produtoId: produtoId,
                    quantidade: quantidade,
                    descricao: descricao,
                    status: "Aberta",
                    createdAt: new Date(),
                });
                alert("Requisição cadastrada com sucesso!");
            }
            setProdutoId("");
            setQuantidade(0);
            setDescricao("");
            setIsEditing(false);
            setCurrentId(null);
            getRequisicao();
        } catch (error) {
            console.error("Erro ao salvar requisição:", error);
            alert("Erro ao salvar requisição.");
        } finally {
            setLoading(false);
        }
    }

    const getRequisicao = async () => {
        const data = await getDocs(requisicaoRef);
        setListaRequisicao(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };


    const getProdutoNome = (produtoId) => {
        const produto = listaProdutos.find(f => f.id === produtoId);
        return produto ? produto.nome : "Desconhecido";
    };

    const handleEdit = (requisicao) => {
        setProdutoId(requisicao.produtoId);
        setQuantidade(requisicao.quantidade);
        setDescricao(requisicao.descricao);
        setIsEditing(true);
        setCurrentId(requisicao.id);
    };

    const handleRemove = async (id) => {
        const confirm = window.confirm("Deseja realmente remover esta requisição?");
        if (!confirm) return;

        try {
            const contatoDoc = doc(db, "requisicao", id);
            await deleteDoc(contatoDoc);
            alert("Requisição removida com sucesso!");
            getRequisicao();
        } catch (error) {
            console.error("Erro ao remover requisição:", error);
            alert("Erro ao remover requisição.");
        }
    };


    useEffect(() => {
        getProdutos();
        getRequisicao();
    }, []);


    return (
        <main className="min-h-screen w-screen bg-bronzeBg text-bronzePrimaryText
        flex flex-col p-14">
            <h1 className="text-center text-3xl font-bold mb-7">
                Tela colaborador
            </h1>

            <div className="flex flex-row justify-start w-full my-14">
                <div className="bg-bronzeComponent rounded border border-bronzeBorder w-1/3 h-fit mr-28 p-7">
                    <h3 className="text-xl">{isEditing ? "Editar Requisição" : "Cadastro Requisição de Compra"}</h3>

                    <select
                        value={produtoId}
                        onChange={(e) => setProdutoId(e.target.value)}
                        className="w-full p-3 mt-5 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                    >
                        <option value="">Selecione um Produto</option>
                        {listaProdutos.map((produto) => (
                            <option key={produto.id} value={produto.id}>
                                {produto.nome}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Quantidade necessária"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        className="w-full p-3 mt-3 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                    />

                    <input
                        type="text"
                        placeholder="Descrição da requisição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full p-3 mt-3 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                    />

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-bronzeButtons border-bronzePrimaryText rounded w-fit p-2 mt-5"
                    >
                        {loading ? "Salvando..." : isEditing ? "Atualizar" : "Salvar"}
                    </button>
                </div>

                <div className="bg-bronzeComponent px-7 py-5 rounded border border-bronzeBorder grid grid-cols-1 gap-4
                w-1/3">
                    {listaRequisicao.map((requisicao) => (
                        <div key={requisicao.id} className="p-2.5 bg-bronzeBg h-fit border border-bronzeBorder rounded">
                            <p className="text-lg">Nome Usuário</p>

                            <p className="text-lg">Status: {requisicao.status}</p>

                            <p>Quantidade: {requisicao.quantidade}</p>

                            <p className="text-sm w-1/5 overflow-hidden">
                                Categoria: {getProdutoNome(requisicao.produtoId)}
                            </p>

                            <p className="
                             mx-2.5 my-3.5 p-2
                             border border-bronzeSecondaryText bg-bronzeBg rounded
                             text-pretty"
                               style={{ wordWrap: 'break-word' }}>{requisicao.descricao}</p>
                            <div className="flex flex-row mt-2.5">
                                <button
                                    onClick={() => handleEdit(requisicao)}
                                    className="bg-bronzeBg border border-bronzeSecondaryText p-1.5 rounded-md text-sm mr-2"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleRemove(requisicao.id)}
                                    className="bg-red-200 border border-red-800 p-1.5 rounded-md text-sm"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default ColaboradorPage;