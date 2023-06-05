import { AiOutlineLoading } from "react-icons/ai";
import { AuthContext, iUserInfo } from "../../contexts/AuthContext";
import { IoMdClose } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserData, updateUserSchema } from "./validations";
import axios from "axios";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

interface iUserBoardProps {
  user: iUserInfo;
  setIsEditUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthErrorModalActive: React.Dispatch<React.SetStateAction<boolean>>;
}
export const UserBoard = ({
  setAuthErrorModalActive,
  setIsEditUserOpen,
  user,
}: iUserBoardProps) => {
  const { isLoading, patchUser, patchSuccess, setIsLoading } =
    useContext(AuthContext);
  const [deleteAwaiting, setIsDeleteAwaiting] = useState<boolean>(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const { register, handleSubmit } = useForm<updateUserData>({
    resolver: zodResolver(updateUserSchema),
  });
  const navigate = useNavigate();
  const deleteUser = async () => {
    const userId = localStorage.getItem("@userId");
    const token = localStorage.getItem("@token");
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    try {
      await api.delete(`/users/${userId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsDeleteAwaiting(false);
      }, 1500);
      setTimeout(() => {
        navigate(`/`);
      }, 2500);
    }
  };

  useEffect(() => {
    const errorInterceptor = (error: Error) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
      }
      if (error.response?.data.message == "Email is already in use!") {
        setIsEmailAvailable(false);
      }
      if (error.response?.status === 401) {
        setAuthErrorModalActive(true);
      }
      return Promise.reject(error);
    };
    const interceptor = api.interceptors.response.use(null, errorInterceptor);

    return () => api.interceptors.response.eject(interceptor);
  });

  return (
    <>
      <div className="pt-20 flex w-full justify-between place-items-center">
        <span className="font-semibold mx-auto">
          Olá, {user.name}! Gostaria de editar suas informações de perfil?
        </span>
        <button
          className=" bg-red-500  cursor-pointer mt-2 mr-5 place-items-center rounded-md p-1"
          onClick={() => {
            setIsEditUserOpen(false);
          }}
        >
          {<IoMdClose className="text-white cursor-pointer"></IoMdClose>}
        </button>
      </div>

      <div className="mt-20 flex flex-col justify-center bg-[#BAC3D0] w-fit mx-auto p-10 rounded-md">
        <form
          className="flex flex-col gap-2 text-black bg-[#BAC3D0]"
          onSubmit={handleSubmit(patchUser)}
        >
          <label className="text-sm" htmlFor="name">
            Nome
          </label>
          <input
            className="p-1 pl-2 rounded-md"
            type="text"
            id="name"
            defaultValue={user?.name}
            {...register("name")}
          />
          <label className="text-sm" htmlFor="phone">
            Número de Telefone
          </label>
          <input
            className="p-1 pl-2 rounded-md"
            type="text"
            id="phone"
            defaultValue={user?.phone}
            {...register("phone")}
          />
          <label className="text-sm" htmlFor="email">
            Email
          </label>
          <input
            className="p-1 pl-2 rounded-md"
            type="email"
            id="email"
            defaultValue={user?.email}
            {...register("email")}
          />
          {!isEmailAvailable && (
            <span
              className="text-red-500 font-semibold
          "
            >
              Email não disponivel!
            </span>
          )}
          <label className="text-sm" htmlFor="password">
            Senha
          </label>
          <input
            className="p-1 pl-2 rounded-md"
            type="password"
            id="email"
            {...register("password")}
          />

          {patchSuccess && (
            <span className="mx-auto font-semibold text-green-700">
              Sucesso!
            </span>
          )}
          <button
            className="bg-blue-600 w-fit text-white rounded-md px-16 mt-6 py-1 mx-auto "
            type="submit"
          >
            {!isLoading ? (
              "Salvar"
            ) : (
              <AiOutlineLoading className="p-0 h-6 mx-auto animate-spin" />
            )}
          </button>
        </form>

        <span className="mx-auto mt-6">Ou</span>

        <button
          onClick={(event) => {
            let button = event.currentTarget;
            button.innerHTML = "Confirmar?";
            button.addEventListener("click", async () => {
              setIsDeleteAwaiting(true);
              deleteUser();
            });
          }}
          className="bg-red-600 text-white mt-3 p-1 rounded-md"
        >
          Deseja remover sua conta?
        </button>
      </div>
    </>
  );
};
