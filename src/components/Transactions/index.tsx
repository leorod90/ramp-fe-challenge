import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

type TransactionsProps = { transactions: Transaction[] | null }

interface Props extends TransactionsProps {
  loadingTransactions: boolean
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  extras?: number;
}

interface Transaction {
  id: string;
  amount: number;
  employee: Employee;
  merchant: string;
  date: string;
  approved: boolean;
}

export const Transactions = ({ transactions, loadingTransactions }: Props) => {
  const { fetchWithoutCache, loading, fetchWithCache } = useCustomFetch()

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
    },
    [fetchWithCache]
  )

  if (transactions === null || loadingTransactions) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction: Transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      )
      )}
    </div>
  )
}
