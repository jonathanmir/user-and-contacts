import { useContext, useEffect, useState } from "react";
import { AuthContext, iContact } from "../../contexts/AuthContext";
import { ContactItem } from "../../components/ContactItem/ContactItem";
import { CreateContactModal } from "../../components/Modals/CreateContactModal";
import api from "../../services/api";
import { FaUserCircle } from "react-icons/fa";
import { EditContactModal } from "../../components/Modals/EditContactModal";
import { AuthenticationErrorModal } from "../../components/Modals/AuthenticationErrorModal";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import { UserBoard } from "../../components/UserBoard/UserBoard";

const Dashboard = () => {
  const {
    setIsLoading,
    isLoading,
    userInfo,
    getUserContacts,
    setUserContacts,
    userContacts,
  } = useContext(AuthContext);

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [checkedElement, setCheckedElement] = useState<boolean>(false);
  const [createModalActive, setModalActive] = useState(false);
  const [editModalActive, setEditModalActive] = useState(false);
  const [authErrorModalActive, setAuthErrorModalActive] = useState(false);
  const [clickedContact, setClickedContact] = useState<iContact | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const toggleModal = (modalActive: boolean, which: string) =>
    which == "edit"
      ? setEditModalActive(!modalActive)
      : which == "error"
      ? setAuthErrorModalActive(!modalActive)
      : setModalActive(!modalActive);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const closestLi: HTMLLIElement = event.target.closest("li")!;
    let updatedList = [...checkedList];
    if (event.target.checked) {
      updatedList = [...checkedList, closestLi.id];
      setCheckedList(updatedList);
    } else {
      const id = event.target.id;
      updatedList.splice(updatedList.indexOf(id), 1);
      setCheckedList(updatedList);
    }
  };

  const deleteContacts = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let button = event.currentTarget;
    button.className = "bg-red-500 text-white rounded-md h-fit p-2  w-[112px]";
    button.innerHTML = "Confirmar?";
    button.addEventListener("click", async () => {
      const filterRemainingContacts = userContacts.filter(
        (e) => !checkedList.includes(e.id)
      );

      const contactIds = checkedList.filter((id) => checkedList.includes(id));
      const data = {
        contactIds: contactIds,
      };
      try {
        setIsLoading(true);
        await api
          .delete("contacts/", {
            data,
          })
          .then(() => {
            setTimeout(() => {
              const checkboxes = document.querySelectorAll<HTMLInputElement>(
                "input[type='checkbox']"
              );
              checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
              });
              setCheckedList([]);
              setIsLoading(false);
              setUserContacts(filterRemainingContacts);
            }, 800);
          });
      } catch (err) {
        console.error(err);
      }
    });
  };

  useEffect(() => {
    getUserContacts();
  }, []);

  return (
    <main className="container mx-auto">
      {authErrorModalActive &&
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 5500)}
      {authErrorModalActive && (
        <AuthenticationErrorModal
          toggleModal={() => toggleModal(authErrorModalActive, "error")}
        />
      )}
      {createModalActive && (
        <CreateContactModal
          setAuthErrorModalActive={setAuthErrorModalActive}
          toggleModal={() => toggleModal(createModalActive, "create")}
        />
      )}
      {editModalActive && (
        <EditContactModal
          setAuthErrorModalActive={setAuthErrorModalActive}
          contactInfo={clickedContact}
          toggleModal={() => toggleModal(editModalActive, "edit")}
        />
      )}
      <div
        id="header-dash"
        className="absolute left-0 flex items-center  text-center w-full h-12  bg-blue-600"
      >
        <div className="container flex justify-between mx-auto text-white font-bold ">
          <h1 className=" w-fit">Contact Manager</h1>
          <div className="flex">
            <FaUserCircle
              onClick={() => {
                setIsEditUserOpen(true);
              }}
              className="cursor-pointer w-14 h-8"
            />
          </div>
        </div>
      </div>
      <>
        {!isEditUserOpen ? (
          <UserBoard
            user={userInfo}
            setAuthErrorModalActive={setAuthErrorModalActive}
            setIsEditUserOpen={setIsEditUserOpen}
          />
        ) : (
          <>
            <div className="pt-20">
              <h2 className="w-fit">Olá, {userInfo?.name}, seja bem vindo!</h2>
              <h2 className="w-fit">Esses são os seus contatos.</h2>
              <div className="flex py-10 items-center w-2/3 justify-between">
                <div className="flex gap-20 p-2">
                  <h3 className=" self-center">
                    Contatos ({userContacts.length})
                  </h3>
                  <button
                    onClick={() => toggleModal(createModalActive, "create")}
                    className=" bg-blue-600 text-white px-6 rounded-md p-1"
                  >
                    Criar Novo
                  </button>
                </div>
                {checkedList.length > 0 ? (
                  <div className="flex w-1/3 place-items-center justify-between">
                    <span className="">{`${checkedList.length}    Selecionados`}</span>
                    {!isLoading ? (
                      <button
                        onClick={(event) => {
                          deleteContacts(event);
                        }}
                        className="bg-red-500 text-white rounded-md h-fit p-2 px-3"
                      >
                        Deletar contato(s)?
                      </button>
                    ) : (
                      <button className="py-5 h-6 bg-red-500 flex place-items-center rounded-md ">
                        <AiOutlineLoading className=" mx-auto animate-spin text-white w-[112px]" />
                      </button>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="ml-2 flex mt-10 w-full justify-between">
                <span className="w-1/4">Nome</span>
                <span className="w-1/4 ml-5">E-mail</span>
                <span className="w-1/4 mr-2">Número de telefone</span>
              </div>

              <ul id="contactList" className="flex pt-10 w-full gap-2 flex-col">
                {userContacts.map((e: iContact, i) => (
                  <>
                    <ContactItem
                      setClickedContact={setClickedContact}
                      editModalActive={editModalActive}
                      toggleModal={toggleModal}
                      checked={checkedElement}
                      setCheckedElement={setCheckedElement}
                      contacts={userContacts}
                      handleCheck={handleCheck}
                      id={e.id}
                      key={i}
                      contact={e}
                    />
                  </>
                ))}
              </ul>
            </div>
            {userContacts.length > 12 && (
              <span
                className="border-2 cursor-pointer rounded-md bg-blue-600 text-white p-2 mx-auto flex w-fit mt-10 mb-20"
                onClick={() => {
                  scroll;
                  window.scroll({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Voltar ao topo?
              </span>
            )}
          </>
        )}
      </>
    </main>
  );
};
export default Dashboard;
