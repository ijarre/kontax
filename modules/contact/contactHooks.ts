import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CONTACT_WITH_PHONE, DELETE_PHONES_IN_CONTACT, EDIT_CONTACT_BY_ID, GET_CONTACT_LIST } from "./contactQueries";
import { contactsSchema } from "./contactEntity";
import { z } from "zod";

type UseGetContactListParams = {
  page: number;
  pageSize?: number;
  searchQuery?: string;
  contactId?: number[] | number;
  skip?: boolean;
};

export const useGetContactList = ({ searchQuery, page, pageSize = 10, contactId, skip }: UseGetContactListParams) => {
  const { data, ...rest } = useQuery(GET_CONTACT_LIST, {
    variables: {
      order_by: [
        {
          first_name: "asc_nulls_last",
        },
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      where: {
        _or: searchQuery ? [{ first_name: `%${searchQuery}%` }, { last_name: `%${searchQuery}%` }] : undefined,
        id: contactId
          ? {
              _in: Array.isArray(contactId) ? contactId : undefined,
              _eq: typeof contactId === "number" ? contactId : undefined,
            }
          : undefined,
      },
    },
    skip,
  });
  const parseContact = contactsSchema.safeParse(data?.contact);
  const parseCount = z.number().safeParse(data?.contact_aggregate?.aggregate?.count);

  // TODO: handle parse data error
  const contact = parseContact.success ? parseContact.data : [];
  const count = parseCount.success ? parseCount.data : 0;

  const maxPage = Math.ceil(count / pageSize);
  return {
    data: {
      maxPage,
      contact,
    },
    ...rest,
  };
};

export const useCreateContact = () => {
  return useMutation(CREATE_CONTACT_WITH_PHONE, {
    refetchQueries: [GET_CONTACT_LIST],
  });
};

export const useDeletePhones = () => {
  return useMutation(DELETE_PHONES_IN_CONTACT);
};

export const useEditContactById = () => {
  return useMutation(EDIT_CONTACT_BY_ID);
};
