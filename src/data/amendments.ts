import crypto from 'crypto'

const retired = [
  "MultiSign",
  "TrustSetAuth",
  "FeeEscalation",
  "PayChan",
  "CryptoConditions",
  "TickSize",
  "fix1368",
  "Escrow",
  "fix1373",
  "EnforceInvariants",
  "SortedDirectories",
  "fix1201",
  "fix1512",
  "fix1523",
  "fix1528",
]

const obsolete = [
  "CryptoConditionsSuite",
  "NonFungibleTokensV1",
  "fixNFTokenDirV1",
  "fixNFTokenNegOffer",
]

const xahau = [
  "Hooks",
  "BalanceRewards",
  "PaychanAndEscrowForTokens",
  "URIToken",
  "Import",
  "XahauGenesis",
  "HooksUpdate1",
  "fixXahauV1",  
  "fixXahauV2",
  "Remit",
]

export const amendments = [
  ...obsolete,
  ...retired,
  "OwnerPaysFee",
  "Flow",
  "FlowCross",
  "fix1513",
  "DepositAuth",
  "Checks",
  "fix1571",
  "fix1543",
  "fix1623",
  "DepositPreauth",
  "fix1515",
  "fix1578",
  "MultiSignReserve",
  "fixTakerDryOfferRemoval",
  "fixMasterKeyAsRegularKey",
  "fixCheckThreading",
  "fixPayChanRecipientOwnerDir",
  "DeletableAccounts",
  "fixQualityUpperBound",
  "RequireFullyCanonicalSig",
  "fix1781",
  "HardenedValidations",
  "fixAmendmentMajorityCalc",
  "NegativeUNL",
  "TicketBatch",
  "FlowSortStrands",
  "fixSTAmountCanonicalize",
  "fixRmSmallIncreasedQOffers",
  "CheckCashMakesTrustLine",
  "ExpandedSignerList",
  "NonFungibleTokensV1_1",
  "fixTrustLinesToSelf",
  "fixRemoveNFTokenAutoTrustLine",
  "ImmediateOfferKilled",
  "DisallowIncoming",
  "XRPFees",
  "fixUniversalNumber",
  "fixNonFungibleTokensV1_2",
  "fixNFTokenRemint",
  "fixReducedOffersV1",
  "Clawback",
  "AMM",
  "XChainBridge",
  "fixDisallowIncomingV1",
  "DID",
  "fixFillOrKill",
  "fixNFTokenReserve",
  "fixInnerObjTemplate",
  "PriceOracle",
  "fixAMMOverflowOffer",
  ...xahau
]

const amendmentInfo = amendments.reduce((prev, curr) => {
  return { ...prev, [crypto.createHash('sha512').update(curr).digest('hex').slice(0, 64).toUpperCase()]: curr }
}, {} as Record<string, string>)


export const getAmendmentName = (id: string) => {
  console.log(amendmentInfo[id.replace('\"', "")] || id)
  return amendmentInfo[id.replace('\"', "")] || id
}
