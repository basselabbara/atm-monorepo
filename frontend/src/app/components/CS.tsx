import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { stripFloat, stripInt } from '../utils/utils';
import { useCreateAccount, useGetAccountDetails } from '../hooks';

const initialScreen = 'Welcome to the ATM. Please enter your account number...';

const Cs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialBalance, setInitialBalance] = useState('0.00');
  const [accountNumber, setAccountNumber] = useState(0);
  const [balanceAccountNumber, setBalanceAccountNumber] = useState(0);
  const [type, setType] = useState('CHECKING');
  const [name, setName] = useState('');
  const [screen, setScreen] = useState<React.ReactNode>(initialScreen);

  const { mutateAsync: createAccount } = useCreateAccount();
  const { mutateAsync: getAccountDetails } = useGetAccountDetails();

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      const response = await createAccount({
        initialBalance: parseFloat(initialBalance),
        accountNumber: accountNumber,
        type,
        name,
      });
      setScreen(`Account created: ${response.accountNumber}`);
      setAccountNumber(0);
      setInitialBalance('0.00');
      setType('CHECKING');
      setName('');
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAccountDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getAccountDetails(balanceAccountNumber);
      setScreen(
        <Box display="flex" flexDirection={'column'}>
          <Typography variant="h6">
            Account Number: {response.accountNumber}
          </Typography>
          <Typography variant="h6">Balance: ${response.balance}</Typography>
          <Typography variant="h6">Type: {response.type}</Typography>
          <Typography variant="h6">Name: {response.name}</Typography>
          <Typography variant="h6">
            Credit Limit: {response.creditLimit}
          </Typography>
          <Typography variant="h6">Transactions:</Typography>
          <Box display="flex" flexDirection={'column'}>
            {response.transactions.map((t) => (
              <Typography variant="h6">
                {t.type === 'DEPOSIT' ? '+' : '-'}${t.amount} (
                {t.date.toLocaleString('en-US')})
              </Typography>
            ))}
          </Box>
        </Box>
      );
      setBalanceAccountNumber(0);
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
      <Typography variant="h3">Customer Service</Typography>
      <Box
        sx={{
          padding: 2,
          backgroundColor: 'black',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="body1" fontSize="15px">
          {isLoading ? 'Processing request...' : screen}
        </Typography>
      </Box>
      <Box display="flex" gap={2}>
        <Box display="flex" flexDirection={'column'} gap={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            label="Account Number"
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(stripInt(e.target.value));
            }}
          />
          <TextField
            label="Initial Balance"
            value={initialBalance}
            onChange={(e) => {
              setInitialBalance(stripFloat(e.target.value));
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="Age"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value={'CREDIT'}>Credit</MenuItem>
              <MenuItem value={'CHECKING'}>Checking</MenuItem>
              <MenuItem value={'SAVINGS'}>Savings</MenuItem>
            </Select>
          </FormControl>
          <Button disabled={isLoading} onClick={handleCreateAccount}>
            Create Account
          </Button>
        </Box>
        <Box display="flex" flexDirection={'column'} gap={2}>
          <TextField
            label="Account Number"
            value={balanceAccountNumber}
            onChange={(e) => {
              setBalanceAccountNumber(stripInt(e.target.value));
            }}
          />
          <Button disabled={isLoading} onClick={handleGetAccountDetails}>
            Get Account Details
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Cs;
