import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserData, createUserSchema } from "./validator";
import { useContext } from "react";
import { AuthContext, iUserInfo } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import pngContactLogo from "../../assets/meeting-10-256.png";
import { AiOutlineLoading } from "react-icons/ai";
import { SubmitHandler } from "react-hook-form";
import api from "../../services/api";

const RegisterPage = () => {
  const { isLoading, setIsLoading } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createUserData>({
    resolver: zodResolver(createUserSchema),
  });
  const navigate = useNavigate();
  const createUser: SubmitHandler<iUserInfo> = async (data: iUserInfo) => {
    try {
      setIsLoading(true);
      const response = await api.post(`/users`, {
        ...data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 1500);
    }
  };
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
              onSubmit={handleSubmit(createUser)}
              className="flex flex-col justify-center rounded-tr-md rounded-br-md gap-5 h-4/5 bg-white w-1/3 p-12"
              action=""
            >
              <h2 className="font-semibold mx-auto mb-5">
                Crie uma conta para usar nossas funcionalidades!
              </h2>
              <label className="font-semibold mb-1" htmlFor="name">
                Nome
              </label>
              <input
                className="pl-2 border-2 border-black h-8 rounded-md "
                type="text"
                placeholder="Insira seu nome..."
                {...register("name")}
              />
              {errors.name && (
                <span className="mt-0 text-red-600 ">
                  {errors.name.message}
                </span>
              )}
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
              {errors.password && (
                <span className="mt-0 text-red-600 ">
                  {errors.password.message}
                </span>
              )}
              <label className="font-semibold mb-1" htmlFor="phone">
                Telefone de contato
              </label>
              <input
                className="pl-2 border-2 border-black h-8 rounded-md "
                type="text"
                placeholder="Insira seu telefone..."
                {...register("phone")}
              />
              {errors.phone && (
                <span className="mt-0 text-red-600 ">
                  {errors.phone.message}
                </span>
              )}

              <button
                type="submit"
                className="my-3 disabled:opacity-60 bg-[#25283D] text-white rounded-md p-2 px-3"
                disabled={!isLoading ? false : true}
              >
                {!isLoading ? (
                  "Cadastrar"
                ) : (
                  <AiOutlineLoading className="p-0 h-6 mx-auto animate-spin" />
                )}
              </button>

              <span>
                Já possui uma conta?{" "}
                <Link className=" text-[#DC493A]" to={"/login"}>
                  Entrar
                </Link>
              </span>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default RegisterPage;
