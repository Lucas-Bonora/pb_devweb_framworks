'use client';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import {auth} from '@/config/firebase'
import { useRouter } from 'next/navigation';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/sign-up');
    };

    const handleSignIn = async () => {
        try {
            const res = await signInWithEmailAndPassword(email, password);
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
        <div className="min-h-screen flex items-center justify-center bg-bronzeBg">
            <div className="p-10 rounded-lg shadow-xl w-96 bg-bronzeComponent shadow-bronzeComponent/50">
                <h1 className="text-2xl mb-5 text-bronzePrimaryText">Entrar</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 rounded outline-none bg-bronzeBg text-bronzePrimaryText placeholder-bronzeSecondaryText"
                />
                <button
                    onClick={handleSignIn}
                    className="w-full p-3 rounded text-bronzePrimaryText bg-bronzeButtons border-2 border-bronzeBorder"
                    disabled={loading}
                >
                    {loading ? 'Entrando' : 'Entrar'}
                </button>

                <div className="flex flex-row mt-4 text-bronzePrimaryText">
                    <p>
                        Não tem conta?
                    </p>
                    <button className="ml-2 underline"
                            onClick={handleSignUp}>
                        Clique aqui
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
