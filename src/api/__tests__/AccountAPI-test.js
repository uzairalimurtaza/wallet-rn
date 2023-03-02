/* ----- ---- --- -- -
 * Copyright 2020 The Axiom Foundation. All Rights Reserved.
 *
 * Licensed under the Apache License 2.0 (the "License").  You may not use
 * this file except in compliance with the License.  You can obtain a copy
 * in the file LICENSE in the source distribution or at
 * https://www.apache.org/licenses/LICENSE-2.0.txt
 * - -- --- ---- -----
 */

import OrderAPI from '../OrderAPI'
import AccountAPI from '../AccountAPI'
import data from '../data'
import MockHelper from '../../helpers/MockHelper'

const addresses = data.addresses

test('getAddressData should return something back', async () => {
  MockHelper.mockServiceDiscovery()
  MockHelper.mockAccountAPI()
  MockHelper.mockAccountsAPI()

  const ndau = await AccountAPI.getAddressData(addresses)

  expect(ndau).toBeDefined()
})

test('getMarketPrice should return something back', async () => {
  MockHelper.mockServiceDiscovery()
  MockHelper.mockMarketPriceAPI()

  const marketPrice = await OrderAPI.getMarketPrice()

  expect(marketPrice).toBeDefined()
})

test('accountHistory should return something back', async () => {
  MockHelper.mockServiceDiscovery()
  MockHelper.mockAccountHistory('1234asdf')

  const theAccountHistory = await AccountAPI.accountHistory('1234asdf')

  expect(theAccountHistory).toBeDefined()
})

test('isAddressDataNew should report correctly with minor change', async () => {
  MockHelper.mockServiceDiscovery()
  MockHelper.mockAccountsAPI()

  const ndau = await AccountAPI.getAddressData(addresses)

  expect(ndau).toBeDefined()

  MockHelper.mockAccountsAPI({
    ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun: {
      balance: 4200000001.23,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: 'ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz',
      delegationNode: null,
      lock: null,
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz: {
      balance: 20000000000.2,
      validationKeys: null,
      rewardsTarget: 'ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun',
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: {
        noticePeriod: 2592000000000,
        unlocksOn: null
      },
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndamm8kxzf9754axd24wrkh3agvj2cidx75wdfhjiufcjf55: {
      balance: 40000000000.54,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: 'ndanhgm5avd68gj9ufiwq7ttcsshxciupgz5i7nnzk68f67g',
      delegationNode: null,
      lock: {
        noticePeriod: null,
        unlocksOn: 1585886400000
      },
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndanhgm5avd68gj9ufiwq7ttcsshxciupgz5i7nnzk68f67g: {
      balance: 7600000000.03,
      validationKeys: null,
      rewardsTarget: 'ndamm8kxzf9754axd24wrkh3agvj2cidx75wdfhjiufcjf55',
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: {
        noticePeriod: null,
        unlocksOn: 1585886400000
      },
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndafwi9munvx8uhgg3pmaw7m6p22ixp5mpv7nipgc5zjyp5c: {
      balance: 40000000000.87,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: null,
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndap34mk6yzyiru49ivfitgzybkfqxnejcr9qvtnd3ychbfq: {
      balance: 12400000000.23,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: {
        noticePeriod: 7776000000000,
        unlocksOn: null
      },
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndaq9euuwf83yds7f3bwcfqdqsx43x5v4vjbcctkndy2fk98: {
      balance: 51500000000.0,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: null,
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    }
  })

  expect(await AccountAPI.isAddressDataNew(addresses)).toBeTruthy()
})

test('isAddressDataNew should report correctly with no change', async () => {
  MockHelper.mockServiceDiscovery()
  MockHelper.mockAccountsAPI()

  const ndau = await AccountAPI.getAddressData(addresses)

  expect(ndau).toBeDefined()

  expect(await AccountAPI.isAddressDataNew(addresses)).toBeFalsy()
})

test('isAddressDataNew should report correctly with large change', async () => {
  MockHelper.mockServiceDiscovery()
  MockHelper.mockAccountsAPI()

  const ndau = await AccountAPI.getAddressData(addresses)

  expect(ndau).toBeDefined()

  MockHelper.mockAccountsAPI({
    ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun: {
      balance: 4200000001.23,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: 'ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz',
      delegationNode: null,
      lock: null,
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndaiap4q2me85dtnp5naifa5d8xtmrimm4b997hr9mcm38vz: {
      balance: 20000000000.2,
      validationKeys: null,
      rewardsTarget: 'ndarc8etbkidm5ewytxhvzida94sgg9mvr3aswufbty8zcun',
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: {
        noticePeriod: 2592000000000,
        unlocksOn: null
      },
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndamm8kxzf9754axd24wrkh3agvj2cidx75wdfhjiufcjf55: {
      balance: 40000000000.54,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: 'ndanhgm5avd68gj9ufiwq7ttcsshxciupgz5i7nnzk68f67g',
      delegationNode: null,
      lock: {
        noticePeriod: null,
        unlocksOn: 1585886400000
      },
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndanhgm5avd68gj9ufiwq7ttcsshxciupgz5i7nnzk68f67g: {
      balance: 7600000000.03,
      validationKeys: null,
      rewardsTarget: 'ndamm8kxzf9754axd24wrkh3agvj2cidx75wdfhjiufcjf55',
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: {
        noticePeriod: null,
        unlocksOn: 1585886400000
      },
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndafwi9munvx8uhgg3pmaw7m6p22ixp5mpv7nipgc5zjyp5c: {
      balance: 40000000000.87,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: null,
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndap34mk6yzyiru49ivfitgzybkfqxnejcr9qvtnd3ychbfq: {
      balance: 12400000000.23,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: {
        noticePeriod: 7776000000000,
        unlocksOn: null
      },
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndaq9euuwf83yds7f3bwcfqdqsx43x5v4vjbcctkndy2fk98: {
      balance: 51500000000.0,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: null,
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    },
    ndaq9euuwf83yds7f3bwcfqdqsx43x5v4vjbcctkndy2fk12: {
      balance: 61500000000.0,
      validationKeys: null,
      rewardsTarget: null,
      incomingRewardsFrom: null,
      delegationNode: null,
      lock: null,
      stake: null,
      lastEAIUpdate: 589991567000000,
      lastWAAUpdate: 589991567000000,
      weightedAverageAge: 0,
      sequence: 0,
      holds: null,
      recourseSettings: { period: 0, changesAt: null, next: null },
      validationScript: null
    }
  })

  expect(await AccountAPI.isAddressDataNew(addresses)).toBeTruthy()
})

test('getNextSequence should get the correct next sequence', async () => {
  MockHelper.mockServiceDiscovery()
  MockHelper.mockAccountAPI()

  const nextSequence = await AccountAPI.getNextSequence(
    'tnaq9cjf54ct59bmua78iuv6gtpjtdunc78q8jebwgmxyacb'
  )

  expect(nextSequence).toBe(3830689465)
})
