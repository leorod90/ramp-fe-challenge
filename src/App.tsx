import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"
import { useCustomFetch } from "./hooks/useCustomFetch"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, moreData, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const { clearCache } = useCustomFetch()

  const [isLoading, setIsLoading] = useState(false)
  const [loadingTransactions, setLoadingTransactions] = useState(false)


  const [showViewMore, setShowViewMore] = useState(false)

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )

  const loadAllTransactions = useCallback(async () => {

    transactionsByEmployeeUtils.invalidateData()

    // await employeeUtils.fetchAll()

    await paginatedTransactionsUtils.fetchAll()
    setShowViewMore(true)
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const getAllEmployeeNames = useCallback(async () => {
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()
    await employeeUtils.fetchAll()

    setIsLoading(false)
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])


  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      setShowViewMore(false)
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      getAllEmployeeNames()
      loadAllTransactions()

    }
  }, [employeeUtils.loading, employees, loadAllTransactions])


  const onChangeHandler = async (newValue: any) => {
    if (newValue === null) {
      return
    }
    setLoadingTransactions(true)
    if (newValue?.id) {
      await loadTransactionsByEmployee(newValue.id)
      setLoadingTransactions(false)
    } else {
      await loadAllTransactions()
      setLoadingTransactions(false)
    }
  }

  const loadMoreHandler = async () => {
    try {
      await loadAllTransactions()
    } catch (error) {
      setShowViewMore(false)
    }
  }

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />
        <button onClick={clearCache}>clear cache</button>
        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={onChangeHandler}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} loadingTransactions={loadingTransactions} />

          {transactions !== null && moreData && showViewMore && (
            <button
              className="RampButton"
              disabled={paginatedTransactionsUtils.loading}
              onClick={loadMoreHandler}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
