import { Generated, Selectable } from 'kysely'

export interface UserAccount {
  did: string
  handle: string | null
  email: string
  passwordScrypt: string
  createdAt: string
  emailConfirmedAt: string | null
  invitesDisabled: Generated<0 | 1>
  inviteNote: string | null
  takedownId: string | null
}

export type UserAccountEntry = Selectable<UserAccount>

export const tableName = 'user_account'

export type PartialDB = { [tableName]: UserAccount }