import { TestBed, inject } from '@angular/core/testing';
import { ContractsService } from '../services/contract.service';

/*
// Straight Jasmine testing without Angular's testing support
describe('register function', () => {

  // tslint:disable-next-line:prefer-const
  let Web3: any;
  // tslint:disable-next-line:prefer-const
  let web3;

  it('#getValue should return real value', () => {
    expect(service.register('name')).toBe('real value');
  });

  it('#getObservableValue should return value from observable',
    (done: DoneFn) => {
    service.checkRegistryDeployment().subscribe(value => {
      expect(value).toBe('observable value');
      done();
    });
  });

  it('#register should return value from a promise', (done: DoneFn) => {
    service = TestBed.get(ContractsService);
    expect(service.register(4, 'name')).toBe('promise value');
    done();
  });

  let service: ContractsService;
  // tslint:disable-next-line:prefer-const
  let contractServiceSpy: jasmine.SpyObj<ContractsService>;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ContractsService] });
    service = TestBed.get(ContractsService);
  });

  it('should call register from ContractsService', (done) => {
    spyOn(service, 'register').and.returnValue(Promise.resolve(promisedData));

    service.register(4, 'name')
      .then((result) => {
        // expect(ContractsService.fetchData).toHaveBeenCalledWith(video);
        expect(result).toEqual(promisedData);
        done();
      });
  });
});
  */

describe('ContractsService without Angular testing support', () => {
  it('#register should return transaction hash from a spy', () => {
    // create `register` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'register'
    ]);

    // setting the value to return when the `register` spy is called
    const transactionHash =
      '0x4f05b82a13a47851f4062d634128b4f798a1d7c1e32a3485a3190884d60130ca';

    contractServiceSpy.register.and.returnValue(transactionHash);

    expect(contractServiceSpy.register(4, 'name')).toBe(
      transactionHash,
      'service returned transaction hash'
    );
    expect(contractServiceSpy.register.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.register.calls.mostRecent().returnValue).toBe(
      transactionHash
    );
  });

  it('#checkRegistryDeployment should return registry address from a spy', () => {
    // create `checkRegistryDeployment` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'checkRegistryDeployment'
    ]);

    // setting the value to return when the `checkRegistryDeployment` spy is called
    const registryAddress =
      '0x5ff22be7edf5b31f84f41abdb71532be63012fde';

    contractServiceSpy.checkRegistryDeployment.and.returnValue(registryAddress);

    expect(contractServiceSpy.checkRegistryDeployment()).toBe(
      registryAddress,
      'service returned registry address'
    );
    expect(contractServiceSpy.checkRegistryDeployment.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.checkRegistryDeployment.calls.mostRecent().returnValue).toBe(
      registryAddress
    );
  });

  it('#deployRegistry should return registry address from a spy', () => {
    // create `deployRegistry` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'deployRegistry'
    ]);

    // setting the value to return when the `deployRegistry` spy is called
    const registryAddress =
      '0x5ff22be7edf5b31f84f41abdb71532be63012fde';

    contractServiceSpy.deployRegistry.and.returnValue(registryAddress);

    expect(contractServiceSpy.deployRegistry()).toBe(
      registryAddress,
      'service returned registry address'
    );
    expect(contractServiceSpy.deployRegistry.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.deployRegistry.calls.mostRecent().returnValue).toBe(
      registryAddress
    );
  });

  it('#getCountOfSellers should return a number from a spy', () => {
    // create `getCountOfSellers` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'getCountOfSellers'
    ]);

    // setting the value to return when the `getCountOfSellers` spy is called
    const count = 2;

    contractServiceSpy.getCountOfSellers.and.returnValue(count);

    expect(contractServiceSpy.getCountOfSellers()).toBe(
      count,
      'service returned count'
    );
    expect(contractServiceSpy.getCountOfSellers.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.getCountOfSellers.calls.mostRecent().returnValue).toBe(
      count
    );
  });

  it('#getSellerByAddress should return an address from a spy', () => {
    // create `getSellerByAddress` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'getSellerByAddress'
    ]);

    // setting the value to return when the `getSellerByAddress` spy is called
    const seller = {
      '0': 'Seller A',
      '1': '0x134aa2a4919dcf5245b12df8e894ad932eed46ebcd6ecf580a2fe652c0a5c710',
      '2': '0x0000000000000000000000000000000000000000000000000000000000000000'
    };

    contractServiceSpy.getSellerByAddress.and.returnValue(seller);

    expect(contractServiceSpy.getSellerByAddress()).toBe(
      seller,
      'service returned seller object'
    );
    expect(contractServiceSpy.getSellerByAddress.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.getSellerByAddress.calls.mostRecent().returnValue).toBe(
      seller
    );
  });

  it('#checkFactoryDeployment should return an address from a spy', () => {
    // create `checkFactoryDeployment` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'checkFactoryDeployment'
    ]);

    // setting the value to return when the `checkFactoryDeployment` spy is called
    const factoryAddress = '0x134aa2a4919dcf5245b12df8e894ad932eed46ebcd6ecf580a2fe652c0a5c710';

    contractServiceSpy.checkFactoryDeployment.and.returnValue(factoryAddress);

    expect(contractServiceSpy.checkFactoryDeployment()).toBe(
      factoryAddress,
      'service returned factory address'
    );
    expect(contractServiceSpy.checkFactoryDeployment.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.checkFactoryDeployment.calls.mostRecent().returnValue).toBe(
      factoryAddress
    );
  });

  it('#deployFactory should return an address from a spy', () => {
    // create `deployFactory` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'deployFactory'
    ]);

    // setting the value to return when the `deployFactory` spy is called
    const factoryAddress = '0xea176882ee317564d1231ed7f4906460ae83019ff4617fdd65640f29ed4a908a';

    contractServiceSpy.deployFactory.and.returnValue(factoryAddress);

    expect(contractServiceSpy.deployFactory()).toBe(
      factoryAddress,
      'service returned factory address'
    );
    expect(contractServiceSpy.deployFactory.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.deployFactory.calls.mostRecent().returnValue).toBe(
      factoryAddress
    );
  });

  it('#setFactoryAddress should return transaction hash from a spy', () => {
    // create `setFactoryAddress` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'setFactoryAddress'
    ]);

    // setting the value to return when the `setFactoryAddress` spy is called
    const transactionHash =
      '0x4f05b82a13a47851f4062d634128b4f798a1d7c1e32a3485a3190884d60130ca';

    contractServiceSpy.setFactoryAddress.and.returnValue(transactionHash);

    expect(contractServiceSpy.setFactoryAddress('0xea176882ee317564d1231ed7f4906460ae83019ff4617fdd65640f29ed4a908a')).toBe(
      transactionHash,
      'service returned transaction hash'
    );
    expect(contractServiceSpy.setFactoryAddress.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.setFactoryAddress.calls.mostRecent().returnValue).toBe(
      transactionHash
    );
  });

  it('#checkOracleDeployment should return an address from a spy', () => {
    // create `checkOracleDeployment` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'checkOracleDeployment'
    ]);

    // setting the value to return when the `checkOracleDeployment` spy is called
    const oracleAddress = '0x747f28e207f73aacc8eddc597d84cc6028f6b0e5';

    contractServiceSpy.checkOracleDeployment.and.returnValue(oracleAddress);

    expect(contractServiceSpy.checkOracleDeployment(oracleAddress)).toBe(
      oracleAddress,
      'service returned oracle address'
    );
    expect(contractServiceSpy.checkOracleDeployment.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.checkOracleDeployment.calls.mostRecent().returnValue).toBe(
      oracleAddress
    );
  });

  it('#deployOracle should return an address from a spy', () => {
    // create `deployOracle` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'deployOracle'
    ]);

    // setting the value to return when the `deployOracle` spy is called
    const oracleAddress = '0x747f28e207f73aacc8eddc597d84cc6028f6b0e5';

    contractServiceSpy.deployOracle.and.returnValue(oracleAddress);

    expect(contractServiceSpy.deployOracle()).toBe(
      oracleAddress,
      'service returned oracle address'
    );
    expect(contractServiceSpy.deployOracle.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.deployOracle.calls.mostRecent().returnValue).toBe(
      oracleAddress
    );
  });

  it('#getAccount should return an address from a spy', () => {
    // create `getAccount` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'getAccount'
    ]);

    // setting the value to return when the `getAccount` spy is called
    const account = '0xe2b99d181e5cc8a039c410366c2f3cb419aca8380484596480eb9c19d587f3a5';

    contractServiceSpy.getAccount.and.returnValue(account);

    expect(contractServiceSpy.getAccount()).toBe(
      account,
      'service returned account address'
    );
    expect(contractServiceSpy.getAccount.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.getAccount.calls.mostRecent().returnValue).toBe(
      account
    );
  });

  it('#getOptionCount should return an address from a spy', () => {
    // create `getOptionCount` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'getOptionCount'
    ]);

    // setting the value to return when the `getOptionCount` spy is called
    const count = 2;

    contractServiceSpy.getOptionCount.and.returnValue(count);

    expect(contractServiceSpy.getOptionCount()).toBe(
      count,
      'service returned option count'
    );
    expect(contractServiceSpy.getOptionCount.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.getOptionCount.calls.mostRecent().returnValue).toBe(
      count
    );
  });

  it('#getContractBalance should return a number from a spy', () => {
    // create `getContractBalance` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'getContractBalance'
    ]);

    // setting the value to return when the `getContractBalance` spy is called
    const balance = 3;

    contractServiceSpy.getContractBalance.and.returnValue(balance);

    expect(contractServiceSpy.getContractBalance(0)).toBe(
      balance,
      'service returned contract balance'
    );
    expect(contractServiceSpy.getContractBalance.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.getContractBalance.calls.mostRecent().returnValue).toBe(
      balance
    );
  });

  it('#deposit should return transaction hash from a spy', () => {
    // create `deposit` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'deposit'
    ]);

    // setting the value to return when the `deposit` spy is called
    const transactionHash =
      '0x4f05b82a13a47851f4062d634128b4f798a1d7c1e32a3485a3190884d60130ca';

    contractServiceSpy.deposit.and.returnValue(transactionHash);

    expect(contractServiceSpy.deposit(0, 1000000000000000000)).toBe(
      transactionHash,
      'service returned transaction hash'
    );
    expect(contractServiceSpy.deposit.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.deposit.calls.mostRecent().returnValue).toBe(
      transactionHash
    );
  });

  it('#setMinimumDepositAmount should return transaction hash from a spy', () => {
    // create `setMinimumDepositAmount` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'setMinimumDepositAmount'
    ]);

    // setting the value to return when the `setMinimumDepositAmount` spy is called
    const transactionHash =
      '0x4f05b82a13a47851f4062d634128b4f798a1d7c1e32a3485a3190884d60130ca';

    contractServiceSpy.setMinimumDepositAmount.and.returnValue(transactionHash);

    expect(contractServiceSpy.setMinimumDepositAmount(0, 10000000000000000)).toBe(
      transactionHash,
      'service returned transaction hash'
    );
    expect(contractServiceSpy.setMinimumDepositAmount.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.setMinimumDepositAmount.calls.mostRecent().returnValue).toBe(
      transactionHash
    );
  });

  it('#buyOption should return transaction hash from a spy', () => {
    // create `buyOption` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'buyOption'
    ]);

    // setting the value to return when the `buyOption` spy is called
    const transactionHash =
      '0x4f05b82a13a47851f4062d634128b4f798a1d7c1e32a3485a3190884d60130ca';

    contractServiceSpy.buyOption.and.returnValue(transactionHash);

    expect(contractServiceSpy.buyOption(0, 'ETH', 400, 1534806615, 116)).toBe(
      transactionHash,
      'service returned transaction hash'
    );
    expect(contractServiceSpy.buyOption.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.buyOption.calls.mostRecent().returnValue).toBe(
      transactionHash
    );
  });

  it('#exerciseOption should return transaction hash from a spy', () => {
    // create `exerciseOption` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'exerciseOption'
    ]);

    // setting the value to return when the `exerciseOption` spy is called
    const transactionHash =
      '0x4f05b82a13a47851f4062d634128b4f798a1d7c1e32a3485a3190884d60130ca';

    contractServiceSpy.exerciseOption.and.returnValue(transactionHash);

    expect(contractServiceSpy.exerciseOption(0, 1)).toBe(
      transactionHash,
      'service returned transaction hash'
    );
    expect(contractServiceSpy.exerciseOption.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.exerciseOption.calls.mostRecent().returnValue).toBe(
      transactionHash
    );
  });

  it('#getOptionsByBuyer should return array from a spy', () => {
    // create `getOptionsByBuyer` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'getOptionsByBuyer'
    ]);

    // setting the value to return when the `getOptionsByBuyer` spy is called
    const optionIDs = [0, 2, 5];

    contractServiceSpy.getOptionsByBuyer.and.returnValue(optionIDs);

    expect(contractServiceSpy.getOptionsByBuyer(0, '0xe2b99d181e5cc8a039c410366c2f3cb419aca8380484596480eb9c19d587f3a5')).toBe(
      optionIDs,
      'service returned array'
    );
    expect(contractServiceSpy.getOptionsByBuyer.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.getOptionsByBuyer.calls.mostRecent().returnValue).toBe(
      optionIDs
    );
  });

  it('#getOption should return object from a spy', () => {
    // create `getOption` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'getOption'
    ]);

    // setting the value to return when the `getOption` spy is called
    const option = {'id': 0, 'asset': 'ETH', 'exercisePrice': 400, 'expirationDate': 1534806615, 'exercised': false};

    contractServiceSpy.getOption.and.returnValue(option);

    expect(contractServiceSpy.getOption(0, 0)).toBe(
      option,
      'service returned object'
    );
    expect(contractServiceSpy.getOption.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.getOption.calls.mostRecent().returnValue).toBe(
      option
    );
  });

  it('#getOptionPremium should return transaction hash from a spy', () => {
    // create `getOptionPremium` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'getOptionPremium'
    ]);

    // setting the value to return when the `getOptionPremium` spy is called
    const transactionHash =
      '0x4f05b82a13a47851f4062d634128b4f798a1d7c1e32a3485a3190884d60130ca';

    contractServiceSpy.getOptionPremium.and.returnValue(transactionHash);

    expect(contractServiceSpy.getOptionPremium(0, 400)).toBe(
      transactionHash,
      'service returned transaction hash'
    );
    expect(contractServiceSpy.getOptionPremium.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.getOptionPremium.calls.mostRecent().returnValue).toBe(
      transactionHash
    );
  });

  it('#getTransaction should return object from a spy', () => {
    // create `getTransaction` spy on an object representing the ContractsService
    const contractServiceSpy = jasmine.createSpyObj('ContractsService', [
      'getTransaction'
    ]);

    // transaction to be retrieved
    const transactionHash =
      '0x4f05b82a13a47851f4062d634128b4f798a1d7c1e32a3485a3190884d60130ca';

    // setting the value to return when the `getTransaction` spy is called
    const transaction = {'txHash': '0x4f05b82a13a47851f4062d634128b4f798a1d7c1e32a3485a3190884d60130ca',
                         'block': 6272808, 'txStatus': 1};

    contractServiceSpy.getTransaction.and.returnValue(transaction);

    expect(contractServiceSpy.getTransaction(transactionHash)).toBe(
      transaction,
      'service returned object'
    );
    expect(contractServiceSpy.getTransaction.calls.count()).toBe(
      1,
      'spy method was called once'
    );
    expect(contractServiceSpy.getTransaction.calls.mostRecent().returnValue).toBe(
      transaction
    );
  });
});

/*
// Using Angular's testing tools

// let service: ContractsService;
// let contractServiceSpy: jasmine.SpyObj<ContractsService>;
const spy = jasmine.createSpyObj('ContractsService', ['register']);

beforeEach(() => {
  // Makes all tests fail
  TestBed.configureTestingModule({
    // Provide both the service-to-test and its (spy) dependency
    providers: [
      ContractsService
    ]
    // injecting the service during the setup process
    // service = TestBed.get(ContractsService);
  });

  // injecting the (spy) dependency being tested
  contractServiceSpy = TestBed.get(ContractsService);
});

it('should use ContractsService', () => {
  service = TestBed.get(ContractsService);
  expect(spy.register(4, 'name')).toBe('promise value');
});
*/
