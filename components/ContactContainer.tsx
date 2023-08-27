import React, { useEffect, useState } from "react";
import { useCreateContact, useDeletePhones, useEditContactById, useGetContactList } from "../modules/contact/contactHooks";
import { ContactList } from "./ContactList";
import { FormInitialValue, ModalContactForm } from "./ModalContactForm";

export function ContactContainer() {
  const [allContactPage, setAllContactPage] = useState(1);

  const [favoriteContact, setFavoriteContact] = useState<number[]>([]);

  const [modalAction, setModalAction] = useState<"create" | "edit" | null>(null);
  const [editContactId, setEditContactId] = useState<number | null>(null);

  useEffect(() => {
    if (favoriteContact.length === 0) {
      setFavoriteContact(JSON.parse(localStorage.getItem("favorite_contact") || "[]"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: allContactData } = useGetContactList({ page: allContactPage });
  const { data: favoriteContactData } = useGetContactList({ page: 1, pageSize: 100, contactId: favoriteContact, skip: favoriteContact.length === 0 });
  const [createContact, { loading }] = useCreateContact();
  const [editContactById] = useEditContactById();

  const { data: contactToEdit } = useGetContactList({ page: 1, skip: modalAction !== "edit" && !editContactId, contactId: editContactId || 0 });

  const onToggleFavorite = (id: number, action: "add" | "remove") => {
    switch (action) {
      case "add":
        setFavoriteContact([...favoriteContact, id]);
        localStorage.setItem("favorite_contact", JSON.stringify([...favoriteContact, id]));
        break;
      case "remove":
        const filteredFavorite = favoriteContact.filter((contactId) => contactId !== id);
        setFavoriteContact(filteredFavorite);
        localStorage.setItem("favorite_contact", JSON.stringify(filteredFavorite));
        break;
      default:
        break;
    }
  };

  const submitFormHandler = async (data: FormInitialValue) => {
    const { first_name, phones, last_name } = data;
    if (modalAction === "create") {
      createContact({
        variables: {
          first_name,
          last_name,
          phones,
        },
        onCompleted: () => {
          setModalAction(null);
        },
      });
    }
    if (modalAction === "edit" && contactToEdit.contact?.[0] && editContactId) {
      await editContactById({
        variables: {
          id: editContactId,
          _set: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
        },
      });
    }
  };
  const onEditContactHandler = (id: number) => {
    setModalAction("edit");
    setEditContactId(id);
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold">Favorite Contact</p>
          <ContactList contacts={favoriteContactData.contact} onToggleFavorite={onToggleFavorite} favoriteContactId={favoriteContact} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full flex items-center justify-between">
            <p className="text-xl font-semibold">All Contact</p>
            <button className="btn btn-outline" onClick={() => setModalAction("create")}>
              Add contact
            </button>
          </div>
          <ContactList
            contacts={allContactData.contact}
            page={allContactPage}
            maxPage={allContactData.maxPage}
            onChangePage={(page) => setAllContactPage(page)}
            onToggleFavorite={onToggleFavorite}
            favoriteContactId={favoriteContact}
            onEditClick={onEditContactHandler}
          />
        </div>
        {modalAction && <ModalContactForm handleToggle={() => setModalAction((val) => (!val ? "create" : null))} onSubmit={submitFormHandler} isLoading={loading} defaultValue={contactToEdit.contact?.[0]} action={modalAction} />}
      </div>
    </>
  );
}
