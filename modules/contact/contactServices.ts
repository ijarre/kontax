import { useQuery } from "@apollo/client";
import { GET_CONTACT_LIST } from "./contactQueries";
import { contactsSchema } from "./contactEntity";
import { z } from "zod";

type UseGetContactListParams = {
  page: number;
  pageSize?: number;
  searchQuery?: string;
  contactId?: number[];
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
      offset: page,
      where: {
        _or: searchQuery ? [{ first_name: `%${searchQuery}%` }, { last_name: `%${searchQuery}%` }] : undefined,
        id: contactId
          ? {
              _in: contactId,
            }
          : undefined,
      },
    },
    skip,
  });
  const parseContact = contactsSchema.safeParse(data?.contact);
  const parseCount = z.number().safeParse(data?.contact_aggregate.aggregate);

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
