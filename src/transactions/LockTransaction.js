/* ----- ---- --- -- -
 * Copyright 2020 The Axiom Foundation. All Rights Reserved.
 *
 * Licensed under the Apache License 2.0 (the "License").  You may not use
 * this file except in compliance with the License.  You can obtain a copy
 * in the file LICENSE in the source distribution or at
 * https://www.apache.org/licenses/LICENSE-2.0.txt
 * - -- --- ---- -----
 */

export class LockTransaction {
  constructor (wallet, account, period) {
    this._wallet = wallet
    this._account = account
    this._period = period

    this._keys = wallet.keys
    this._jsonTransaction = {}

    if (!this._wallet || !this._account) {
      throw new Error('You must pass wallet and account')
    }

    this._period = period
    this.transactionType = 'Lock'
  }

  addToJsonTransaction = () => {
    this._jsonTransaction.period = this._period
    this._jsonTransaction.target = this._account.address
  }

  getSignature = () => {
    return this._jsonTransaction.signatures
  }

  async createSignPrevalidateSubmit () {
    try {
      await this.create()
      await this.sign()
      await this.prevalidate()
      await this.submit()
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }
}
