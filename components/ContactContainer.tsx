import React, { useEffect, useState } from "react";
import { useGetContactList } from "../modules/contact/contactServices";
import { ContactList } from "./ContactList";
import Modal from "./Modal";
import { ModalContactForm } from "./ModalContactForm";

export function ContactContainer() {
  const [allContactPage, setAllContactPage] = useState(1);

  const [favoriteContact, setFavoriteContact] = useState<number[]>([]);

  useEffect(() => {
    if (favoriteContact.length === 0) {
      setFavoriteContact(JSON.parse(localStorage.getItem("favorite_contact") || "[]"));
    }
  }, []);

  const { data: allContactData } = useGetContactList({ page: allContactPage });
  const { data: favoriteContactData } = useGetContactList({ page: 1, pageSize: 100, contactId: favoriteContact, skip: favoriteContact.length === 0 });

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
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">Favorite Contact</p>
        <ContactList contacts={favoriteContactData.contact} onToggleFavorite={onToggleFavorite} favoriteContactId={favoriteContact} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">All Contact</p>
        <ContactList contacts={allContactData.contact} page={allContactPage} maxPage={allContactData.maxPage} onChangePage={(page) => setAllContactPage(page)} onToggleFavorite={onToggleFavorite} favoriteContactId={favoriteContact} />
      </div>
      <ModalContactForm handleToggle={() => console.log("asd")} />
    </div>
  );
}
