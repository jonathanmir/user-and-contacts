import { useEffect } from "react";
import { iContact } from "../../contexts/AuthContext";

interface iContactProps {
  contact: iContact;
  contacts: iContact[];
  handleCheck: (event: React.ChangeEvent<HTMLInputElement>) => any;
  checked: boolean;
  setCheckedElement: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  toggleModal: (arg: boolean, which: string) => void;
  editModalActive: boolean;
  setClickedContact: React.Dispatch<React.SetStateAction<iContact | null>>;
}
export const ContactItem = ({
  contact,
  handleCheck,
  contacts,
  checked,
  setClickedContact,
  toggleModal,
  editModalActive,
  id,
}: iContactProps) => {
  useEffect(() => {}, [contacts]);
  return (
    <>
      <li
        id={id}
        className={
          checked
            ? "flex bg-[#d2dbe9] checked-contact w-full cursor-pointer  rounded-md p-2"
            : "flex hover:bg-[#d2dbe9] cursor-pointer w-full  rounded-md p-2"
        }
      >
        <input
          className="cursor-pointer"
          type="checkbox"
          defaultChecked={false}
          onChange={(event) => handleCheck(event)}
        />
        <div
          className="ml-2 flex justify-between w-full truncate ..."
          onClick={() => {
            toggleModal(editModalActive, "edit");
            setClickedContact(contact);
          }}
        >
          <span className="text-ellipsis overflow-hidden w-1/4 truncate ...">
            {contact.name}
          </span>
          <span className="truncate w-1/4 ">{contact.email}</span>
          <span className="w-1/4">{contact.phone}</span>
        </div>
      </li>
    </>
  );
};
