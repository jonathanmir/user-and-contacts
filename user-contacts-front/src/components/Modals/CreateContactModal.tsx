import { useContext } from "react";
import { AuthContext, iContact } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { createContactData, createContactSchema } from "./validations";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { Modal } from "./GenericModal";
import { IoMdClose } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";

interface iModalProps {
  setAuthErrorModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  toggleModal: () => void;
}
export const CreateContactModal = ({
  toggleModal,
  setAuthErrorModalActive,
}: iModalProps) => {
  const { setUserContacts, isLoading, setIsLoading } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createContactData>({
    resolver: zodResolver(createContactSchema),
  });

  const createContact = async (data: createContactData) => {
    const userId = localStorage.getItem("@userId")!;
    let newContact: iContact;

    try {
      setIsLoading(true);
      const response = await api.post("contacts", {
        ...data,
        userId: userId,
      });
      newContact = response.data;
    } catch (err) {
      setIsLoading(false);
      setAuthErrorModalActive(true);
    } finally {
      setTimeout(() => {
        setUserContacts((prev) => [newContact, ...prev]);
        setIsLoading(false);
        toggleModal();
      }, 700);
    }
  };
  return (
    <Modal toggleModal={toggleModal}>
      <div className="flex flex-col relative w-full">
        <IoMdClose
          onClick={() => {
            toggleModal();
          }}
          className="absolute cursor-pointer top-1 right-0"
        ></IoMdClose>
        <h2 className="pb-5 font-bold">Criar novo contato</h2>
        <form
          className="flex flex-col gap-2 text-black"
          onSubmit={handleSubmit(createContact)}
        >
          <label className="text-sm" htmlFor="name">
            Nome
          </label>
          <input
            className="p-1 pl-2 rounded-md"
            type="text"
            id="name"
            {...register("name")}
          />
          {errors.name && (
            <span className="mt-0 text-red-600 ">{errors.name.message}</span>
          )}
          <label className="text-sm" htmlFor="phone">
            Número de Telefone
          </label>
          <input
            className="p-1 pl-2 rounded-md"
            type="text"
            id="phone"
            {...register("phone")}
          />
          {errors.phone && (
            <span className="mt-0 text-red-600 ">{errors.phone.message}</span>
          )}

          <label className="text-sm" htmlFor="name">
            Email
          </label>
          <input
            className="p-1 pl-2 rounded-md"
            type="email"
            id="email"
            {...register("email")}
          />
          {errors.email && (
            <span className="mt-0 text-red-600 ">{errors.email.message}</span>
          )}
          {!isLoading ? (
            <button
              className="bg-blue-600 w-full h-8 text-white rounded-md my-4 mx-auto"
              type="submit"
            >
              Criar
            </button>
          ) : (
            <button className="my-4 bg-blue-600 h-8 rounded-md">
              <AiOutlineLoading className="text-white mx-auto animate-spin" />
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
};
