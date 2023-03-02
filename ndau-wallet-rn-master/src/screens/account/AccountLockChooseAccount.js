/* ----- ---- --- -- -
 * Copyright 2020 The Axiom Foundation. All Rights Reserved.
 *
 * Licensed under the Apache License 2.0 (the "License").  You may not use
 * this file except in compliance with the License.  You can obtain a copy
 * in the file LICENSE in the source distribution or at
 * https://www.apache.org/licenses/LICENSE-2.0.txt
 * - -- --- ---- -----
 */

import React, { Component } from 'react'

import {
  AccountLockDetailsPanel,
  AccountLockContainer,
  AccountLockTypeButton,
  AccountLockLargerText
} from '../../components/account'
import AccountStore from '../../stores/AccountStore'
import WalletStore from '../../stores/WalletStore'
import FlashNotification from '../../components/common/FlashNotification'
import { RadioButton } from '../../components/common'
import { ScrollView } from 'react-native'

const _ = require('lodash')

class AccountLockChooseAccount extends Component {
  constructor (props) {
    super(props)
    this.state = {
      account: {},
      wallet: {},
      lockInformation: null,
      accountsCanRxEAI: {},
      accountAddressForEAI: null,
      accountNicknameForEAI: null
    }
    props.navigation.addListener('blur', FlashNotification.hideMessage)
  }

  UNSAFE_componentWillMount = async () => {
    const accountsCanRxEAI = this.props.route.params?.accountsCanRxEAI ?? {}

    const account = AccountStore.getAccount()
    const wallet = WalletStore.getWallet()
    const lockInformation = this.props.route.params?.lockInformation ?? null

    // clone the object stored at the screen level.
    // the iteration of the clones keys allows us to
    // remove/filter out this account from the list
    const accountsCanRxEAIClone = _.clone(accountsCanRxEAI)
    Object.keys(accountsCanRxEAIClone).map(key => {
      if (key === account.addressData.nickname) {
        delete accountsCanRxEAIClone[key]
      }
    })

    this.setState({
      account,
      wallet,
      accountsCanRxEAI: accountsCanRxEAIClone,
      accountAddressForEAI: Object.values(accountsCanRxEAIClone)[0],
      accountNicknameForEAI: Object.keys(accountsCanRxEAIClone)[0],
      lockInformation
    })
  }

  _showLockConfirmation = () => {
    this.props.navigation.navigate('AccountLockConfirmation', {
      account: this.state.account,
      wallet: this.state.wallet,
      lockInformation: this.state.lockInformation,
      accountAddressForEAI: this.state.accountAddressForEAI,
      accountNicknameForEAI: this.state.accountNicknameForEAI
    })
  }

  render () {
    return (
      <AccountLockContainer
        title='Lock account'
        account={this.state.account}
        wallet={this.state.wallet}
        navigation={this.props.nav}
        {...this.props}
      >
        <ScrollView>
          <AccountLockDetailsPanel account={this.state.account}>
            <AccountLockLargerText>
              Your available accounts:
            </AccountLockLargerText>
            <RadioButton
              options={Object.keys(this.state.accountsCanRxEAI)}
              values={Object.values(this.state.accountsCanRxEAI)}
              defaultSelected={Object.values(this.state.accountsCanRxEAI)[0]}
              onChange={value => {
                let accountNicknameForEAI
                for (const key in this.state.accountsCanRxEAI) {
                  if (this.state.accountsCanRxEAI[key] === value) {
                    accountNicknameForEAI = key
                    break
                  }
                }
                this.setState({
                  accountAddressForEAI: value,
                  accountNicknameForEAI
                })
              }}
            />
          </AccountLockDetailsPanel>

          <AccountLockTypeButton
            smallText={
              'Note: You will not be able to deposit into, spend, transfer, or otherwise access the principal in this account while it is locked'
            }
            onPress={this._showLockConfirmation}
          >
            Continue
          </AccountLockTypeButton>
        </ScrollView>
      </AccountLockContainer>
    )
  }
}

export default AccountLockChooseAccount
