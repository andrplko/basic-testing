import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

const senderInitialBalance = 500;
const recipientInitialBalance = 300;

describe('BankAccount', () => {
  const sender = getBankAccount(senderInitialBalance);
  const recipient = getBankAccount(recipientInitialBalance);

  test('should create account with initial balance', () => {
    const senderBalance = sender.getBalance();

    expect(senderBalance).toBe(senderInitialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const exceedingAmount = 600;

    expect(() => sender.withdraw(exceedingAmount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const exceedingAmount = 600;

    expect(() => sender.transfer(exceedingAmount, recipient)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const transferAmount = 400;

    expect(() => sender.transfer(transferAmount, sender)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const depositAmount = 400;

    sender.deposit(depositAmount);

    expect(sender.getBalance()).toBe(senderInitialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const senderBalanceBeforeWithdrawal = sender.getBalance();
    const withdrawalAmount = 500;

    sender.withdraw(withdrawalAmount);

    const senderBalanceAfterWithdrawal = sender.getBalance();

    expect(senderBalanceAfterWithdrawal).toBe(
      senderBalanceBeforeWithdrawal - withdrawalAmount,
    );
  });

  test('should transfer money', () => {
    const senderBalanceBeforeTransfer = sender.getBalance();
    const recipientBalanceBeforeTransfer = recipient.getBalance();

    const transferAmount = 200;

    sender.transfer(transferAmount, recipient);

    const senderBalanceAfterTransfer = sender.getBalance();
    const recipientBalanceAfterTransfer = recipient.getBalance();

    expect(senderBalanceAfterTransfer).toBe(
      senderBalanceBeforeTransfer - transferAmount,
    );
    expect(recipientBalanceAfterTransfer).toBe(
      recipientBalanceBeforeTransfer + transferAmount,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const result = await sender.fetchBalance();

    if (result) {
      expect(typeof result).toBe('number');
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const mockedValue = 40;
    sender.fetchBalance = jest.fn().mockResolvedValue(mockedValue);

    await sender.synchronizeBalance();

    expect(sender.getBalance()).toBe(mockedValue);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const mockedValue = null;
    sender.fetchBalance = jest.fn().mockResolvedValue(mockedValue);

    await expect(sender.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
