'use client';

import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/config/firebase';
import {useRouter} from "next/navigation";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSignIn = () => {
        router.push('/sign-in');
    };

    const handleSignUp = async () => {
        try {
            const res = await createUserWithEmailAndPassword(email, password);
            console.log({ res });
            sessionStorage.setItem('user', 'true');
            setEmail('');
            setPassword('');
            router.push('/product-feed');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-bronzeBg`}>
            <div className={'p-10 rounded-lg shadow-xl w-96 bg-bronzeComponent shadow-bronzeComponent/50'}>
                <h1 className={`text-2xl mb-5 text-bronzePrimaryText`}>Cadastro</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-3 mb-4 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText`}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-3 mb-4 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText`}
                />
                <button
                    onClick={handleSignUp}
                    className={`w-full p-3 rounded text-bronzePrimaryText bg-bronzeButtons border-2 border-bronzeBorder`}
                    disabled={loading}
                >
                    {loading ? 'Cadastranso...' : 'Cadastrar'}
                </button>

                <div className="flex flex-row mt-4 text-bronzePrimaryText">
                    <p>
                        Já tem conta?
                    </p>
                    <button className="ml-2 underline"
                            onClick={handleSignIn}>
                        Clique aqui
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SignUp;