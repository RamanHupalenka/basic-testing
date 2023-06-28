// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import lodash from 'lodash';

const initialBalance = 1000;
const valueMoreThanBalance = initialBalance + 10;
const zeroValue = 0;
const fetchBalanceMockValue = 50;
const requestFailedMockValue = 0.5;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(initialBalance);
    const currentBalance = bankAccount.getBalance();

    expect(currentBalance).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(initialBalance);

    const testFn = () => bankAccount.withdraw(valueMoreThanBalance);

    expect(testFn).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const myBankAccount = getBankAccount(initialBalance);
    const friendBankAccount = getBankAccount(zeroValue);

    const testFn = () =>
      myBankAccount.transfer(valueMoreThanBalance, friendBankAccount);

    expect(testFn).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const myBankAccount = getBankAccount(initialBalance);

    const testFn = () => myBankAccount.transfer(initialBalance, myBankAccount);

    expect(testFn).toThrowError(TransferFailedError);
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(initialBalance);
    const depositAmount = 100;

    bankAccount.deposit(depositAmount);

    const currentBalance = bankAccount.getBalance();

    expect(currentBalance).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(initialBalance);
    const withdrawAmount = 100;

    bankAccount.withdraw(withdrawAmount);

    const currentBalance = bankAccount.getBalance();

    expect(currentBalance).toBe(initialBalance - withdrawAmount);
  });

  test('should transfer money', () => {
    const myBankAccount = getBankAccount(initialBalance);
    const friendBankAccount = getBankAccount(zeroValue);
    const transferAmount = 500;

    myBankAccount.transfer(transferAmount, friendBankAccount);

    const myCurrentBalance = myBankAccount.getBalance();
    const friendCurrentBalance = myBankAccount.getBalance();

    expect(myCurrentBalance).toBe(initialBalance - transferAmount);
    expect(friendCurrentBalance).toBe(zeroValue + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bankAccount = getBankAccount(initialBalance);
    const randomSpy = jest.spyOn(lodash, 'random');

    randomSpy.mockReturnValueOnce(fetchBalanceMockValue);
    randomSpy.mockReturnValueOnce(requestFailedMockValue);

    const result = await bankAccount.fetchBalance();

    expect(result).toBe(fetchBalanceMockValue);
    expect(randomSpy).toHaveBeenCalledTimes(2);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(initialBalance);
    const randomSpy = jest.spyOn(lodash, 'random');

    randomSpy.mockReturnValueOnce(fetchBalanceMockValue);
    randomSpy.mockReturnValueOnce(requestFailedMockValue);

    await bankAccount.synchronizeBalance();

    const currentBalance = bankAccount.getBalance();

    expect(currentBalance).toBe(fetchBalanceMockValue);
    expect(randomSpy).toHaveBeenCalledTimes(2);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(initialBalance);
    const randomSpy = jest.spyOn(lodash, 'random');

    randomSpy.mockReturnValueOnce(zeroValue);
    randomSpy.mockReturnValueOnce(zeroValue);

    const testFn = async () => await bankAccount.synchronizeBalance();

    await expect(testFn).rejects.toThrowError(SynchronizationFailedError);
    expect(randomSpy).toHaveBeenCalledTimes(2);
  });
});
