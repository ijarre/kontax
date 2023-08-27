import { Contact } from "../modules/contact/contactEntity";
import { ContactCard } from "./ContactCard";

export type ContactListProps = {
  contacts: Contact;
  page?: number;
  maxPage?: number;
  onChangePage?: (page: number) => void;
  onToggleFavorite: (id: number, action: "add" | "remove") => void;
  favoriteContactId: number[];
  onEditClick?: (id: number) => void;
};

export function ContactList(props: ContactListProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {props.contacts.map((contact) => {
          return (
            <ContactCard
              firstName={contact.first_name}
              lastName={contact.last_name}
              phones={contact.phones}
              key={contact.id}
              onToggleFavorite={(action) => props.onToggleFavorite(contact.id, action)}
              isFavorite={props.favoriteContactId.some((val) => val === contact.id)}
              onEditClick={() => props.onEditClick?.(contact.id)}
              showEditButton={!!props.onEditClick}
            />
          );
        })}
      </div>
      {props.page && (
        <div className="join flex gap-1 items-stretch justify-end">
          <button className={`join-item btn ${props.page === 1 ? "btn-disabled" : undefined}`} onClick={() => props.onChangePage?.(props.page ? props.page - 1 : 0)}>
            «
          </button>
          <div className=" btn bg-base-200 h-full hover:bg-base-200 cursor-default">
            <p>{`PAGE ${props.page}`}</p>
          </div>
          <button className={`join-item btn ${props.page === props.maxPage ? "btn-disabled" : undefined}`} onClick={() => props.onChangePage?.(props.page ? props.page + 1 : 0)}>
            »
          </button>
        </div>
      )}
    </div>
  );
}
