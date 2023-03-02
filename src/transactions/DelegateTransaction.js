/* ----- ---- --- -- -
 * Copyright 2020 The Axiom Foundation. All Rights Reserved.
 *
 * Licensed under the Apache License 2.0 (the "License").  You may not use
 * this file except in compliance with the License.  You can obtain a copy
 * in the file LICENSE in the source distribution or at
 * https://www.apache.org/licenses/LICENSE-2.0.txt
 * - -- --- ---- -----
 */

import DataFormatHelper from '../helpers/DataFormatHelper'
import AppConfig from '../AppConfig'

export class DelegateTransaction {
  constructor (wallet, account, node) {
    this._wallet = wallet
    this._account = account

    this._node = node
    this._keys = wallet.keys
    this._jsonTransaction = {}

    if (!this._wallet || !this._account) {
      throw new Error('You must pass wallet and account')
    }

    this.transactionType = 'Delegate'
  }

  addToJsonTransaction = () => {
    this._jsonTransaction.target = this._account.address
    this._jsonTransaction.node = this._node
  }

  getSignature = () => {
    return this._jsonTransaction.signatures
  }

  async createSignPrevalidateSubmit () {
    await this.create()
    await this.sign()
    try {
      await this.prevalidate()
      await this.submit()
    } catch (error) {
      const spendableNapu = DataFormatHelper.spendableNapu(
        this._account.addressData,
        true,
        AppConfig.NDAU_DETAIL_PRECISION
      )
      const data = error.getData()
      if (spendableNapu > data.fee_napu) {
        this.handleError(error)
        throw error
      }
    }
  }
}
