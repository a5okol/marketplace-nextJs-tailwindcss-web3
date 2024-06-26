import { toast } from 'react-toastify';

export const withToast = (promise) => {
  toast.promise(
    promise,
    {
      pending: {
        render() {
          return (
            <div className="p-3 py-2 flex flex-row gap-2">
              <div>
                <p className="mb-2">Your transaction is being processed.</p>
                <p>Hang tight... Just few more moments.</p>
              </div>
            </div>
          );
        },
      },
      success: {
        render({ data }) {
          return (
            <div>
              <p className="font-bold">
                Tx: {data.transactionHash.slice(0, 20)}...
              </p>
              <p>Has been succesfuly processed.</p>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={`https://sepolia.etherscan.io/tx/${data.transactionHash}`}
              >
                <i className="text-indigo-600 underline">See Tx Details</i>
              </a>
            </div>
          );
        },
        // other options
        icon: '🟢',
      },
      error: {
        render({ data }) {
          // When the promise reject, data will contains the error
          return <div>{data.message ?? 'Transaction has failed'}</div>;
        },
      },
    },
    {
      closeButton: true,
    }
  );
};
