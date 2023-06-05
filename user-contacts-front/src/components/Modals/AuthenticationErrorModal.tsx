import { useNavigate } from "react-router-dom";
import { Modal } from "./GenericModal";

interface iModalProps {
  toggleModal: () => void;
}
export const AuthenticationErrorModal = ({ toggleModal }: iModalProps) => {
  const navigate = useNavigate();
  setTimeout(() => {
    localStorage.clear();
    navigate("/");
  }, 5500);

  return (
    <>
      <Modal toggleModal={toggleModal}>
        <div>
          <h1 className=" text-red-700">
            Oops, parece que sua sessão expirou! Você será redirecionado
            automaticamente para a página de login para confirmar sua
            autenticação...
          </h1>
        </div>
      </Modal>
    </>
  );
};
