import { MouseEvent, MouseEventHandler, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

export type ContactCardProps = {
  firstName?: string;
  lastName?: string;
  isFavorite?: boolean;
  phones: { number: string; id: number }[];
  onToggleFavorite: (action: "add" | "remove") => void;
};

export function ContactCard(props: ContactCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isPhonesEmpty = props.phones.length === 0;

  const onToggleCard = () => {
    setIsOpen((val) => !val);
  };
  return (
    <div className="card  bg-primary cursor-pointer text-primary-content" onClick={onToggleCard}>
      <div className={`flex px-4 py-3 justify-between items-center ${isOpen ? "border-b-2 border-base-200 rounded-b-lg" : undefined}`}>
        <div className={`text-lg md:text-xl items-center font-medium flex gap-1 rounded-b-md  `}>
          {props.isFavorite && <div className="mask mask-star-2 w-5 h-5 bg-orange-500 outline-2 outline-black" />}
          <p>{props.firstName}</p>
          <p>{props.lastName}</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="btn btn-sm h-4"
            onClick={(e) => {
              e.stopPropagation();
              props.onToggleFavorite(props.isFavorite ? "remove" : "add");
            }}
          >
            {`${props.isFavorite ? "Remove from" : "Add to"} favorite`}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCard();
            }}
          >
            {isOpen ? <ChevronUpIcon className="w-5 h-5 " /> : <ChevronDownIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 py-3 text-sm md: text-md cursor-default" onClick={(e) => e.stopPropagation()}>
          {isPhonesEmpty ? (
            <p className="mt-1 text-center text-neutral-focus italic font-light">empty</p>
          ) : (
            <ul className=" list-none mt-1">
              {props.phones?.map((phone) => (
                <li className="flex gap-2 items-center" key={phone.id}>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral"></div>
                  <p>{phone.number}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
