"use client"

import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useEffect, useState} from "react";

const Produtos = () => {
    const [nomeProduto, setNomeProduto] = useState("")
    const [descricaoProduto, setDescricaoProduto] = useState("")
    const [listaProdutos, setListaProdutos] = useState([])
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const produtosRef = collection(db, "produtos")

    const handleSave = async () => {
        if (!nomeProduto|| !descricaoProduto) {
            alert("Preencha todos os campos.");
            return;
        }

        setLoading(true)

        try {
            if (isEditing && currentId) {
                const produtosDoc = doc(db, "produtos", currentId);
                await updateDoc(produtosDoc, {
                    nome: nomeProduto,
                    descricao: descricaoProduto,
                });
                alert("Produto atualizado com sucesso!");
            } else {
                await addDoc(produtosRef, {
                    nome: nomeProduto,
                    descricao: descricaoProduto,
                    createdAt: new Date(),
                });
                alert("Produto cadastrado com sucesso!");
            }
            setNomeProduto("");
            setDescricaoProduto("");
            setIsEditing(false);
            setCurrentId(null);
            getProdutos();
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            alert("Erro ao salvar produto.");
        } finally {
            setLoading(false);
        }
    }

    const getProdutos = async () => {
        const data = await getDocs(produtosRef);
        setListaProdutos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const handleRemove = async (id) => {
        const confirm = window.confirm("Deseja realmente remover este produto?");
        if (!confirm) return;

        try {
            const produtoDoc = doc(db, "produtos", id);
            await deleteDoc(produtoDoc);
            alert("Produto removido com sucesso!");
            getProdutos();
        } catch (error) {
            console.error("Erro ao remover produto:", error);
            alert("Erro ao remover produto.");
        }
    };

    const handleEdit = (produto) => {
        setNomeProduto(produto.nome);
        setDescricaoProduto(produto.descricao);
        setIsEditing(true);
        setCurrentId(produto.id);
    };

    useEffect(() => {
        getProdutos();
    }, []);

    return (
        <div className="min-h-screen w-screen p-14 text-bronzePrimaryText">
            <h1 className="text-3xl">Menu de produtos</h1>

            <div className="flex flex-row justify-start w-full my-14">
                <div className="bg-bronzeComponent rounded border border-bronzeBorder w-1/3 h-fit mr-28 p-7">
                    <h3 className="text-xl">{isEditing ? "Editar Produto" : "Cadastro novo Produto"}</h3>

                    <input
                        type="text"
                        placeholder="Nome Produto"
                        value={nomeProduto}
                        onChange={(e) => setNomeProduto(e.target.value)}
                        className="w-full p-3 mt-3 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                    />

                    <input
                        type="text"
                        placeholder="Descrição Produto"
                        value={descricaoProduto}
                        onChange={(e) => setDescricaoProduto(e.target.value)}
                        className="w-full p-3 mt-5 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
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
                w-2/3">
                    {listaProdutos.map((produto) => (
                        <div key={produto.id} className="p-2.5 bg-bronzeBg h-fit border border-bronzeBorder rounded">
                            <p className="mx-2.5 text-lg">{produto.nome}</p>
                            <p className="
                             mx-2.5 my-3.5 p-2
                             border border-bronzeSecondaryText bg-bronzeBg rounded
                             text-pretty"
                               style={{ wordWrap: 'break-word' }}>{produto.descricao}</p>
                            <div className="flex flex-row mt-2.5">
                                <button
                                    onClick={() => handleEdit(produto)}
                                    className="bg-bronzeBg border border-bronzeSecondaryText p-1.5 rounded-md text-sm mr-2"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleRemove(produto.id)}
                                    className="bg-red-200 border border-red-800 p-1.5 rounded-md text-sm"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    )

}

export default Produtos;