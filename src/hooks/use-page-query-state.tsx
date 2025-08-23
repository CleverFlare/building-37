import {
  createLoader,
  parseAsIndex,
  parseAsInteger,
  useQueryStates,
} from "nuqs";

import {
  parseAsIndex as parseAsIndexServer,
  parseAsInteger as parseAsIntegerServer,
} from "nuqs/server";

const paginationParsers = {
  pageIndex: parseAsIndex.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
};

const paginationServerParsers = {
  pageIndex: parseAsIndexServer.withDefault(0),
  pageSize: parseAsIntegerServer.withDefault(10),
};

const paginationUrlKeys = {
  pageIndex: "page",
  pageSize: "perPage",
};

export function usePaginationSearchParams() {
  return useQueryStates(paginationParsers, {
    urlKeys: paginationUrlKeys,
  });
}

export const loadPaginationSearchParams = createLoader(paginationServerParsers);

export const usePageQueryState = () => useQueryStates(paginationParsers);
