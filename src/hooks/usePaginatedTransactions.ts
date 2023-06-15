import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

interface Props extends PaginatedTransactionsResult {
  moreData: boolean
}

export function usePaginatedTransactions(): Props {
  const [moreData, setMoreData] = useState(false)
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    if (paginatedTransactions?.nextPage == null && paginatedTransactions?.data) {
      throw Error('no more')
    } else {
      const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
        "paginatedTransactions",
        {
          page: paginatedTransactions === null ? 0 : paginatedTransactions?.nextPage,
        }
      )
      if (typeof response?.nextPage === 'number' && response?.nextPage >= 0) {
        setMoreData(true)
      } else {
        setMoreData(false)
      }

      setPaginatedTransactions((previousResponse) => {
        if (response === null || previousResponse === null || !response?.data) {
          return response
        }

        return {
          data: [...previousResponse.data, ...response.data],
          nextPage: response.nextPage,
        }
      })
    }

  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData, moreData }
}
