import { useMutation } from 'react-query';
import { account, transaction } from '@prisma/client';

const API_URL = 'http://localhost:3000/api';

interface AccountDetails extends account {
  transactions: transaction[];
}

export const useGetAccountDetails = () => {
  return useMutation(async (accountNumber: number): Promise<AccountDetails> => {
    const response = await fetch(
      `${API_URL}/account-details/${accountNumber}`,
      {
        method: 'GET',
      }
    );

    const resp = await response.json();

    if (response.status >= 400) {
      throw new Error(resp.message);
    }

    return resp;
  });
};

export const useGetAccountBalance = () => {
  return useMutation(async (accountNumber: number): Promise<number> => {
    const response = await fetch(`${API_URL}/balance/${accountNumber}`, {
      method: 'GET',
    });

    const resp = await response.json();

    if (response.status >= 400) {
      throw new Error(resp.message);
    }

    return resp;
  });
};

export const useWithdraw = () => {
  return useMutation(
    async ({
      accountNumber,
      amount,
    }: {
      accountNumber: number;
      amount: number;
    }): Promise<account> => {
      const response = await fetch(`${API_URL}/withdraw/${accountNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const resp = await response.json();

      if (response.status >= 400) {
        throw new Error(resp.message);
      }

      return resp;
    }
  );
};

export const useDeposit = () => {
  return useMutation(
    async ({
      accountNumber,
      amount,
    }: {
      accountNumber: number;
      amount: number;
    }): Promise<account> => {
      const response = await fetch(`${API_URL}/deposit/${accountNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const resp = await response.json();

      if (response.status >= 400) {
        throw new Error(resp.message);
      }

      return resp;
    }
  );
};

export const useCreateAccount = () => {
  return useMutation(
    async (account: {
      accountNumber: number;
      initialBalance: number;
      creditLimit?: number;
      type: string;
      name: string;
    }): Promise<account> => {
      const response = await fetch(`${API_URL}/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
      });

      const resp = await response.json();

      if (response.status >= 400) {
        throw new Error(resp.message);
      }

      return resp;
    }
  );
};
