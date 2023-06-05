import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginData, loginSchema } from "./validator";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import pngContactLogo from "../../assets/meeting-10-256.png";
import { AiOutlineLoading } from "react-icons/ai";

const LoginPage = () => {
  const { isLoading, loginError, login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <>
      <main className="bg-[#BAC3D0]">
        <div className="container mx-auto ">
          <div className="flex h-screen mx-auto justify-center place-items-center">
            <div className="bg-[#3882F6] rounded-tl-md flex flex-col justify-center rounded-bl-md h-4/5 w-2/5 p-10">
              <img className=" w-44 mx-auto" src={pngContactLogo} alt="" />
              <p className="text-center text-white text-2xl">
                Bem vindo a Contact Manager! Ajudamos você a organizar seus
                contatos
              </p>
            </div>
            <form
              onSubmit={handleSubmit(login)}
              className="flex flex-col justify-center rounded-tr-md rounded-br-md gap-5 h-4/5 bg-white w-1/3 p-12"
              action=""
            >
              <h2 className="font-semibold mx-auto mb-5">
                Inicie agora uma sessão com seu e-mail
              </h2>
              <label className="font-semibold mb-1" htmlFor="email">
                Email
              </label>
              <input
                className={`pl-2 border-2 border-black h-8 rounded-md group ${
                  errors.email
                    ? "border border-red-300 autofill:border-red-300  focus:border-red-300 invalid:border-red-300"
                    : ""
                }`}
                type="text"
                placeholder="exemplo@email.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="mt-0 text-red-600 ">
                  {errors.email.message}
                </span>
              )}
              <label className="font-semibold mb-1" htmlFor="password">
                Senha
              </label>
              <input
                className="pl-2 border-2 border-black h-8 rounded-md "
                type="password"
                placeholder="Insira sua senha..."
                {...register("password")}
              />
              {loginError && (
                <span className=" text-red-600">Email ou senha inválidos!</span>
              )}

              <button
                type="submit"
                className="my-3 disabled:opacity-60 bg-[#25283D] text-white rounded-md p-2 px-3"
                disabled={!isLoading ? false : true}
              >
                {!isLoading ? (
                  "Entrar"
                ) : (
                  <AiOutlineLoading className="p-0 h-6 mx-auto animate-spin" />
                )}
              </button>

              <span>
                Ainda não possui uma conta?{" "}
                <Link className=" text-[#DC493A]" to={"/register"}>
                  Cadastre-se!
                </Link>
              </span>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
