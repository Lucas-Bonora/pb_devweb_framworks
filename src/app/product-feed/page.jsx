'use client'
import {getDocs, collection} from "firebase/firestore";
import {db, auth} from "@/config/firebase";
import {useEffect, useState} from "react";
import Link from "next/link";
import { signOut } from 'firebase/auth';

const ProductFeed = () => {

    const [productsList, setProductsList] = useState(null);
    const productRef = collection(db, "Produtos");

    const getProducts = async () => {
        const data = await getDocs(productRef);
        setProductsList(data.docs.map((doc) =>
            ({...doc.data(), id: doc.id})));}

    useEffect(() => {
        getProducts();
    }, []);


    return (
        <main className="min-h-screen w-screen bg-bronzeBg text-bronzePrimaryText
        flex flex-col p-14">
            <h1 className="text-center text-3xl font-bold mb-7">
                Produtos
            </h1>

            <div className="flex flex-row m-7 self-end">
                <button
                    className="mx-7 p-2
                bg-bronzeButtons
                border border-bronzePrimaryText rounded-md
                ">
                    Adicionar Produto
                </button>

                <button
                    className="mx-7 p-2
                bg-bronzeButtons
                border border-bronzePrimaryText rounded-md
                ">
                    Usuários
                </button>

                <button
                    onClick={() => {
                        signOut(auth)
                        sessionStorage.removeItem('user')
                    }}
                    className="mx-7 p-2
                bg-bronzeComponent
                border border-bronzeBorder rounded-md
                "
                >
                    Log out
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-7 px-14">
                {productsList?.map((product, key) => (
                    <div key={key}
                         className="bg-bronzeComponent
                    border border-bronzeBorder p-3.5
                    shadow-lg shadow-bronzeBorder/80
                    flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <Link href={`/product-feed/${product.id}`}
                                  className="border-b border-bronzePrimaryText pr-1.5 h-fit">
                                {product.nome}
                            </Link>
                            <p className="text-sm mt-2">
                                Categoria: {product.categoria}
                            </p>
                        </div>

                        <button className="bg-red-200 border border-red-800
                                        p-1.5 rounded-md text-sm my-3.5">
                            Remover
                        </button>
                    </div>
                ))}
            </div>
        </main>

    )
}

export default ProductFeed;
