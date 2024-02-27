import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { stripFloat, stripInt } from '../utils/utils';
import { useDeposit, useGetAccountBalance, useWithdraw } from '../hooks';

const initialATMScreen =
  'Welcome to the ATM. Please enter your account number...';

const Atm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('0.00');
  const [accountNumber, setAccountNumber] = useState(0);
  const [atmScreen, setAtmScreen] = useState(initialATMScreen);

  const { mutateAsync: deposit } = useDeposit();
  const { mutateAsync: withdraw } = useWithdraw();
  const { mutateAsync: checkBalance } = useGetAccountBalance();

  const handleDeposit = async () => {
    setIsLoading(true);
    try {
      const response = await deposit({
        accountNumber,
        amount: parseFloat(amount),
      });
      setAtmScreen(
        `Deposited ${amount} to account ${accountNumber}, new balance is ${response.balance}`
      );

      setAmount('0.00');
      setAccountNumber(0);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      const response = await withdraw({
        accountNumber,
        amount: parseFloat(amount),
      });
      setAtmScreen(
        `Withdrew ${amount} from account ${accountNumber}, new balance is ${response.balance}`
      );

      setAmount('0.00');
      setAccountNumber(0);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckBalance = async () => {
    setIsLoading(true);
    try {
      const response = await checkBalance(accountNumber);
      setAtmScreen(`Account ${accountNumber} has a balance of ${response}`);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={'column'}
      gap={2}
      justifyContent={'center'}
      alignItems={'center'}
      width="700px"
    >
      <Typography variant="h3">ATM</Typography>
      <Box
        sx={{
          padding: 2,
          backgroundColor: 'black',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="body1" fontSize="15px">
          {isLoading ? 'Processing request...' : atmScreen}
        </Typography>
      </Box>
      <Box>
        <TextField
          label="Account Number"
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(stripInt(e.target.value));
          }}
        />
        <TextField
          label="Amount"
          value={amount}
          onChange={(e) => {
            setAmount(stripFloat(e.target.value));
          }}
        />
      </Box>
      <Box display="flex" gap={2}>
        <Button disabled={isLoading} onClick={handleDeposit}>
          Deposit
        </Button>
        <Button disabled={isLoading} onClick={handleWithdraw}>
          Withdraw
        </Button>
        <Button disabled={isLoading} onClick={handleCheckBalance}>
          Check Balance
        </Button>
      </Box>
    </Box>
  );
};

export default Atm;
