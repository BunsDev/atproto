/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { Headers, XRPCError } from '@atproto/xrpc'
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util'
import { lexicons } from '../../../../lexicons'
import { CID } from 'multiformats/cid'
import * as AppBskyActorDefs from '../actor/defs'

export interface QueryParams {
  actor: string
  limit?: number
  cursor?: string
}

export type InputSchema = undefined

export interface OutputSchema {
  subject: AppBskyActorDefs.ProfileView
  cursor?: string
  followers: AppBskyActorDefs.ProfileView[]
  [k: string]: unknown
}

export interface CallOptions {
  headers?: Headers
}

export interface Response {
  success: boolean
  headers: Headers
  data: OutputSchema
}

export enum ErrorName {}

export function toKnownErr(e: any) {
  if (e instanceof XRPCError) {
  }
  return e
}
