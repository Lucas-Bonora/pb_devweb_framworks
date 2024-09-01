"use client";
import { useEffect, useState } from "react";
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import { db } from "@/config/firebase";

const Contatos = () => {
    const [nomeContato, setNomeContato] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [fornecedorId, setFornecedorId] = useState("");
    const [listaFornecedores, setListaFornecedores] = useState([]);
    const [listaContatos, setListaContatos] = useState([])
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const contatosRef = collection(db, "contatos")



    const getFornecedores = async () => {
        try {
            const fornecedoresRef = collection(db, "fornecedores");
            const data = await getDocs(fornecedoresRef);
            setListaFornecedores(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Erro ao buscar fornecedores:", error);
        }
    };


    const handleSave = async () => {
        if (!nomeContato|| !email|| !telefone|| !fornecedorId) {
            alert("Preencha todos os campos.");
            return;
        }

        setLoading(true)

        try {
            if (isEditing && currentId) {
                const contatosDoc = doc(db, "contatos", currentId);
                await updateDoc(contatosDoc, {
                    nome: nomeContato,
                    email: email,
                    telefone: telefone,
                    fornecedorId: fornecedorId,
                });
                alert("Contato atualizado com sucesso!");
            } else {
                await addDoc(contatosRef, {
                    nome: nomeContato,
                    email: email,
                    telefone: telefone,
                    fornecedorId: fornecedorId,
                    createdAt: new Date(),
                });
                alert("Contato cadastrado com sucesso!");
            }
            setNomeContato("");
            setEmail("");
            setTelefone("");
            setFornecedorId("");
            setIsEditing(false);
            setCurrentId(null);
            getContatos();
        } catch (error) {
            console.error("Erro ao salvar fornecedor:", error);
            alert("Erro ao salvar fornecedor.");
        } finally {
            setLoading(false);
        }
    }

    const getContatos = async () => {
        const data = await getDocs(contatosRef);
        setListaContatos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getFornecedorNome = (fornecedorId) => {
        const fornecedor = listaFornecedores.find(f => f.id === fornecedorId);
        return fornecedor ? fornecedor.nome : "Desconhecido";
    };

    const handleRemove = async (id) => {
        const confirm = window.confirm("Deseja realmente remover este contato?");
        if (!confirm) return;

        try {
            const contatoDoc = doc(db, "contatos", id);
            await deleteDoc(contatoDoc);
            alert("Contato removido com sucesso!");
            getContatos();
        } catch (error) {
            console.error("Erro ao remover contato:", error);
            alert("Erro ao remover contato.");
        }
    };

    const handleEdit = (contato) => {
        setNomeContato(contato.nome);
        setEmail(contato.email);
        setTelefone(contato.telefone);
        setFornecedorId(contato.fornecedorId)
        setIsEditing(true);
        setCurrentId(contato.id);
    };

    useEffect(() => {
        getContatos();
        getFornecedores();
    }, []);


    return (
        <div className="min-h-screen w-screen p-14 text-bronzePrimaryText">
            <h1 className="text-3xl">Menu de contatos</h1>

            <div className="flex flex-row justify-start w-full my-14">
                <div className="bg-bronzeComponent rounded border border-bronzeBorder w-1/3 h-fit mr-28 p-7">
                    <h3 className="text-xl">{isEditing ? "Editar Contato" : "Cadastro novo Contato"}</h3>

                    <input
                        type="text"
                        placeholder="Nome Contato"
                        value={nomeContato}
                        onChange={(e) => setNomeContato(e.target.value)}
                        className="w-full p-3 mt-3 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 mt-5 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                    />

                    <input
                        type="text"
                        placeholder="Telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full p-3 mt-5 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                    />

                    <select
                        value={fornecedorId}
                        onChange={(e) => setFornecedorId(e.target.value)}
                        className="w-full p-3 mt-5 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                    >
                        <option value="">Selecione um Fornecedor</option>
                        {listaFornecedores.map((fornecedor) => (
                            <option key={fornecedor.id} value={fornecedor.id}>
                                {fornecedor.nome}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-bronzeButtons border-bronzePrimaryText rounded w-fit p-2 mt-5"
                    >
                        {loading ? "Salvando..." : isEditing ? "Atualizar" : "Salvar"}
                    </button>
                </div>

                <div className="bg-bronzeComponent rounded border border-bronzeBorder grid grid-cols-1
                p-4  gap-3
                w-2/3 h-fit ">
                    <div className="flex flex-row justify-start p-2.5">
                        <p className="w-1/5">
                            Nome
                        </p>
                        <p className="w-1/5">
                            Email
                        </p>
                        <p className="w-1/5">
                            Telefone
                        </p>
                        <p className="w-1/5">
                            Fornecedor
                        </p>
                    </div>
                    {listaContatos.map((contato) => (
                        <div key={contato.id} className="p-2.5 bg-bronzeBg flex flex-row justify-start
                        border border-bronzeBorder rounded">
                            <p className="text-sm w-1/5 overflow-hidden">
                                {contato.nome}
                            </p>
                            <p className="text-sm w-1/5 overflow-hidden">
                                {contato.email}
                            </p>
                            <p className="text-sm w-1/5 overflow-hidden">
                                {contato.telefone}
                            </p>
                            <p className="text-sm w-1/5 overflow-hidden">
                                {getFornecedorNome(contato.fornecedorId)}
                            </p>
                            <div className="flex flex-row justify-end w-1/5">
                                <button
                                    onClick={() => handleEdit(contato)}
                                    className="bg-bronzeBg h-fit border border-bronzeSecondaryText p-1.5 mr-1.5 rounded-md text-xs"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleRemove(contato.id)}
                                    className="bg-red-200 h-fit border border-red-800 p-1.5 rounded-md text-xs"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contatos;