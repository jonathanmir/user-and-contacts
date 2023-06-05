import { useContext } from "react";
import { AuthContext, iContact } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { updateContactData, updateContactSchema } from "./validations";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { Modal } from "./GenericModal";
import { IoMdClose } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";

interface iModalProps {
  toggleModal: () => void;
  contactInfo: iContact | null;
  setAuthErrorModalActive: React.Dispatch<React.SetStateAction<boolean>>;
}
export const EditContactModal = ({
  setAuthErrorModalActive,
  toggleModal,
  contactInfo,
}: iModalProps) => {
  const { setUserContacts, isLoading, setIsLoading } = useContext(AuthContext);
  const { register, handleSubmit } = useForm<updateContactData>({
    resolver: zodResolver(updateContactSchema),
  });

  const editContact = async (data: updateContactData) => {
    const token = localStorage.getItem("@token");
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    try {
      setIsLoading(true);
      const response = await api.patch(`/contacts/${contactInfo!.id}`, {
        ...data,
      });
      response &&
        setTimeout(() => {
          setUserContacts((prev) => [
            response.data,
            ...prev.filter((contact) => contact.id !== response.data.id),
          ]);
          toggleModal();
          setIsLoading(false);
        }, 700);
    } catch (err) {
      setIsLoading(false);
      setAuthErrorModalActive(true);
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
        <h2 className="pb-5 font-bold">Editar Contato</h2>
        <form
          className="flex flex-col gap-2 text-black"
          onSubmit={handleSubmit(editContact)}
        >
          <label className="text-sm" htmlFor="name">
            Nome
          </label>
          <input
            className="p-1 pl-2 rounded-md"
            type="text"
            id="name"
            defaultValue={contactInfo?.name}
            {...register("name")}
          />
          <label className="text-sm" htmlFor="phone">
            Número de Telefone
          </label>
          <input
            className="p-1 pl-2 rounded-md"
            type="text"
            id="phone"
            defaultValue={contactInfo?.phone}
            {...register("phone")}
          />
          <label className="text-sm" htmlFor="name">
            Email
          </label>
          <input
            className="p-1 pl-2 rounded-md"
            type="email"
            id="email"
            defaultValue={contactInfo?.email}
            {...register("email")}
          />
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
      </div>
    </Modal>
  );
};
