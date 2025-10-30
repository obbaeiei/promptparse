import { encode, tag, withCrcTag } from '@/lib/tlv'

export interface KShopConfig {
  /** Biller ID (Tax ID + Suffix) */
  billerId: string

  /** Reference No. 1 / Merchant No. */
  ref1: string

  /** Reference No. 2 / Transaction ID */
  ref2: string

  /** Transaction amount */
  amount?: number | null
}

/**
 * Generate KShop
 *
 * @returns KShop Payload
 */
export function kShop({ billerId, ref1, ref2, amount }: KShopConfig) {
  const tag30 = [
    tag('00', 'A000000677010112'),
    tag('01', billerId),
    tag('02', ref1),
    tag('03', ref2),
  ]

  const tag31 = [
    tag('00', 'A000000677010113'),
    tag('01', '004'),
    tag('02', ref1),
    tag('04', ref2),
  ]

  const payload = [
    tag('00', '01'),
    tag('01', '11'),
    tag('30', encode(tag30)),
    tag('53', '764'),
    tag('58', 'TH'),
    tag('31', encode(tag31)),
  ]

  if (amount) {
    payload.push(tag('54', Number(amount).toFixed(2)))
  }

  return withCrcTag(encode(payload), '63')
}
