'use client'
import {useRouter} from "next/navigation";

export default function Home() {

  const router = useRouter();

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
      <div className={`min-h-screen flex flex-col items-center justify-center 
        bg-bronzeBg text-bronzePrimaryText text-pretty`}>
        <div className={'w-2/3 bg-bronzeComponent p-10 m-10 rounded-3xl'}>
          <h2 className={'text-lg text-center'}>
            Bem vindo à:
          </h2>
          <h1 className={'text-4xl text-center mt-2'}>
            Siscomp
          </h1>
          <p className={'mt-7'}>
            Esse projeto foi desenvolvido como trabalho final [AT] da disciplina de Desenvolvimento Front-end com Frameworks, ministrada pelo professor Armênio Cardoso
          </p>
          <p className={'mt-7'}>
            O objetivo deste trabalho foi desenvolver um sistema de gerenciamento de compras de uma empresa. Esse sistema deve armazenar todos os itens que a empresa compra com regularidade e ter informações como fornecedores e preços de cada fornecedores.
            Além disso o sistema deverá ter por padrão dois tipos de usuários colaboradores e administradores, com diferentes funções e permissões dentro do sistema.
          </p>
          <p className={'mt-7'}>
            Para logar numa conta de administrador use o email e senha abaixo:
          </p>
          <p className={'mt-7'}>
            Login- lucasbonora11@gmail.com
          </p>
          <p className={'mt-2'}>
            Senha- Siscomp
          </p>
          <div className="mt-7 w-full
                flex justify-center">
            <button className="w-32 h-fit bg-bronzeButtons
                    text-lg rounded-3xl
                    px-2 py-1 mx-3.5
                    border-2 border-bronzeBorder"
                    onClick={handleSignUp}
            >
              Cadastrar
            </button>
            <button className="w-32 h-fit bg-bronzeButtons
                            text-lg rounded-3xl
                            px-2 py-1 mx-3.5
                            border-2 border-bronzeBorder"
                      onClick={handleSignIn}
            >
              Entrar
            </button>
          </div>

        </div>
      </div>
  );
}
