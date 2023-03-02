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
  PixelRatio,
  StyleSheet,
  View,
  Text,
  TouchableHighlight
} from 'react-native'
import SetupStore from '../../stores/SetupStore'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import EntropyHelper from '../../helpers/EntropyHelper'
import AccountHelper from '../../helpers/AccountHelper'
import DataFormatHelper from '../../helpers/DataFormatHelper'
import UserStore from '../../stores/UserStore'
import AppConstants from '../../AppConstants'
import LogStore from '../../stores/LogStore'
import FlashNotification from '../../components/common/FlashNotification'
import {
  SetupContainer,
  RecoveryPhraseConfirmation,
  RecoveryPhraseConfirmationButtons
} from '../../components/setup'
import { LargeButtons, ParagraphText } from '../../components/common'

const _ = require('lodash')

const MAX_ERRORS = 4 // 4 strikes and you're out
const DEFAULT_ROW_LENGTH = 4 // 3 items per row
const TOTAL_RECOVERY_WORDS = 12

let boxWidth = '25%'
let boxHeight = '10%'

class SetupConfirmRecoveryPhrase extends Component {
  constructor (props) {
    super(props)
    this.state = {
      textColor: '#ffffff',
      inError: false,
      mustRetry: false,
      errorCount: 0,
      match: false,
      selected: []
    }

    // chop the words into DEFAULT_ROW_LENGTH-tuples
    this.rowLength = DEFAULT_ROW_LENGTH
    if (PixelRatio.getFontScale() > 2) {
      this.rowLength = 1
      boxWidth = '100%'
      boxHeight = '15%'
    }
    props.navigation.addListener('blur', FlashNotification.hideMessage)
  }

  showNextSetup = async () => {
    let user = UserStore.getUser()
    if (user) {
      // if a user is present then we have wallets and can assume
      // they are logged in, so we get the password setup
      const password = await UserStore.getPassword()
      user = await AccountHelper.addNewWallet(
        user,
        DataFormatHelper.convertRecoveryArrayToString(
          SetupStore.recoveryPhrase
        ),
        AppConstants.TEMP_ID,
        user.userId,
        SetupStore.numberOfAccounts,
        password
      )
    }

    LogStore.log(`user going into SetupWalletName: ${user}`)

    this.props.navigation.navigate('SetupWalletName')
  }

  pushBack = async () => {
    const user = UserStore.getUser()

    await EntropyHelper.generateEntropy()
    this.props.navigation.navigate('SetupYourWallet')
    FlashNotification.hideMessage()
  }

  render () {
    const shuffledWords = SetupStore.shuffledWords
    const words = DataFormatHelper.groupArrayIntoRows(
      shuffledWords,
      this.rowLength
    )

    const selectedWords = this.state.selected.map(selectedIndex => {
      return shuffledWords[selectedIndex]
    })
    const formattedSelectedWords = DataFormatHelper.groupArrayIntoRows(
      selectedWords,
      this.rowLength
    )

    // lookup table for word highlights
    const selected = this.state.selected.reduce((arr, cur) => {
      arr[cur] = true
      return arr
    }, {})

    if (this.state.selected.length === TOTAL_RECOVERY_WORDS) {
      return (
        <SetupContainer {...this.props} pageNumber={15}>
          <ParagraphText>Please verify your recovery phrase.</ParagraphText>
          <RecoveryPhraseConfirmation
            words={formattedSelectedWords || []}
            rowTextView={styles.rowTextView}
          />
          <LargeButtons
            text='Is this correct?'
            onPress={() => this.showNextSetup()}
          >
            Confirm
          </LargeButtons>
          <LargeButtons bottom secondary onPress={() => this.pushBack()}>
            Back
          </LargeButtons>
        </SetupContainer>
      )
    } else {
      return (
        <SetupContainer {...this.props} pageNumber={15}>
          <ParagraphText>Please verify your recovery phrase.</ParagraphText>
          <RecoveryPhraseConfirmation
            words={formattedSelectedWords || []}
            rowTextView={styles.rowTextView}
          />
          <RecoveryPhraseConfirmationButtons
            words={words}
            errorWord={this.state.errorWord}
            selected={selected}
            rowTextView={styles.rowTextView}
            handleClick={this.handleClick}
          />
        </SetupContainer>
      )
    }
  }

  isCorrect (selected) {
    const correctSoFar = SetupStore.shuffledMap.slice(
      0,
      this.state.selected.length
    )
    const recoveryPhrase = SetupStore.shuffledWords
    if (_.isEqual(correctSoFar, selected)) {
      return true
    } else if (
      recoveryPhrase[_(selected).last()] ===
      recoveryPhrase[_(correctSoFar).last()]
    ) {
      // compare the last element of the arrays by string
      return true
    } else {
      return false
    }
  }

  checkMistakes () {
    const { selected } = this.state

    if (!this.isCorrect(selected)) {
      const errorText = this.state.mustRetry
        ? 'Please click the Back button to generate a new recovery phrase. Write down your phrase instead of memorizing it, or you may lose access to your ndau.'
        : 'Please enter the words in the correct order. De-select the last word to continue.'
      FlashNotification.showError(errorText)

      let errorCount = this.state.errorCount + 1
      this.setState({
        inError: true,
        mustRetry: errorCount >= MAX_ERRORS,
        errorCount: errorCount,
        errorWord: this.state.selected[this.state.selected.length - 1]
      })
    } else {
      this.setState({
        inError: false,
        errorWord: null
      })
      FlashNotification.hideMessage()
    }
  }

  checkDone () {
    if (_(this.state.selected).isEqual(SetupStore.shuffledMap)) {
      this.setState({ match: true })
    }
  }

  handleClick = index => {
    const selected = this.state.selected.slice()
    const foundIndex = selected.indexOf(index)
    if (foundIndex !== -1) {
      // already selected item was clicked
      selected.splice(foundIndex, 1)
      this.setState({ selected }, this.afterClick)
    } else if (!this.state.inError) {
      selected.push(index)
      this.setState({ selected }, this.afterClick)
    }
  }

  afterClick () {
    this.checkMistakes()
    this.checkDone()
  }
}

function Word (props) {
  let bgColor = 'transparent'
  if (props.error) {
    bgColor = AppConstants.WARNING_ICON_COLOR
  } else if (props.selected) {
    bgColor = AppConstants.SQUARE_BUTTON_COLOR
  }

  return (
    <TouchableHighlight onPress={props.onPress}>
      <View
        style={{
          height: hp(boxHeight),
          width: wp(boxWidth),
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          borderRadius: 3,
          marginTop: hp('1%'),
          marginBottom: hp('1%'),
          marginLeft: wp('1%'),
          marginRight: wp('1%')
        }}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: 20,
            fontFamily: 'TitilliumWeb-Regular',
            textAlign: 'center'
          }}
        >
          {props.children}
        </Text>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  navButtons: {
    width: wp('40%')
  },
  rowView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
})

export default SetupConfirmRecoveryPhrase
