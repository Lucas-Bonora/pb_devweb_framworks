"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const Fornecedores = () => {
    const [nomeFornecedor, setNomeFornecedor] = useState("");
    const [cepFornecedor, setCepFornecedor] = useState("");
    const [listaFornecedores, setListaFornecedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const fornecedoresRef = collection(db, "fornecedores");

    const handleSave = async () => {
        if (!nomeFornecedor || !cepFornecedor) {
            alert("Preencha todos os campos.");
            return;
        }

        setLoading(true);

        try {
            if (isEditing && currentId) {
                const fornecedorDoc = doc(db, "fornecedores", currentId);
                await updateDoc(fornecedorDoc, {
                    nome: nomeFornecedor,
                    cep: cepFornecedor,
                });
                alert("Fornecedor atualizado com sucesso!");
            } else {
                await addDoc(fornecedoresRef, {
                    nome: nomeFornecedor,
                    cep: cepFornecedor,
                    createdAt: new Date(),
                });
                alert("Fornecedor cadastrado com sucesso!");
            }

            setNomeFornecedor("");
            setCepFornecedor("");
            setIsEditing(false);
            setCurrentId(null);
            getFornecedores();
        } catch (error) {
            console.error("Erro ao salvar fornecedor:", error);
            alert("Erro ao salvar fornecedor.");
        } finally {
            setLoading(false);
        }
    };

    const getFornecedores = async () => {
        const data = await getDocs(fornecedoresRef);
        setListaFornecedores(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const handleRemove = async (id) => {
        const confirm = window.confirm("Deseja realmente remover este fornecedor?");
        if (!confirm) return;

        try {
            const fornecedorDoc = doc(db, "fornecedores", id);
            await deleteDoc(fornecedorDoc);
            alert("Fornecedor removido com sucesso!");
            getFornecedores();
        } catch (error) {
            console.error("Erro ao remover fornecedor:", error);
            alert("Erro ao remover fornecedor.");
        }
    };

    const handleEdit = (fornecedor) => {
        setNomeFornecedor(fornecedor.nome);
        setCepFornecedor(fornecedor.cep);
        setIsEditing(true);
        setCurrentId(fornecedor.id);
    };

    useEffect(() => {
        getFornecedores();
    }, []);

    return (
        <div className="min-h-screen w-screen p-14 text-bronzePrimaryText">
            <h1 className="text-3xl">Menu de fornecedores</h1>

            <div className="flex flex-row justify-start w-full my-14">
                <div className="bg-bronzeComponent rounded border border-bronzeBorder w-1/3 h-fit mr-28 p-7">
                    <h3 className="text-xl">{isEditing ? "Editar Fornecedor" : "Cadastro novo Fornecedor"}</h3>
                    <input
                        type="text"
                        placeholder="Nome Fornecedor"
                        value={nomeFornecedor}
                        onChange={(e) => setNomeFornecedor(e.target.value)}
                        className="w-full p-3 mt-3 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                    />

                    <input
                        type="text"
                        placeholder="Cep Fornecedor"
                        value={cepFornecedor}
                        onChange={(e) => setCepFornecedor(e.target.value)}
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

                <div className="bg-bronzeComponent px-7 py-5 rounded border border-bronzeBorder grid grid-cols-3 gap-4">
                    {listaFornecedores.map((fornecedor) => (
                        <div key={fornecedor.id} className="p-2.5 bg-bronzeBg h-fit border border-bronzeBorder rounded">
                            <p>{fornecedor.nome}</p>
                            <p className="text-sm">Cep: {fornecedor.cep}</p>
                            <div className="flex flex-row mt-2.5">
                                <button
                                    onClick={() => handleEdit(fornecedor)}
                                    className="bg-bronzeBg border border-bronzeSecondaryText p-1.5 rounded-md text-sm mr-2"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleRemove(fornecedor.id)}
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
    );
};

export default Fornecedores;