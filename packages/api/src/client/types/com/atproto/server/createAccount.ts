/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { Headers, XRPCError } from '@atproto/xrpc'
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util'
import { lexicons } from '../../../../lexicons'
import { CID } from 'multiformats/cid'

export interface QueryParams {}

export interface InputSchema {
  email: string
  handle: string
  did?: string
  inviteCode?: string
  password: string
  recoveryKey?: string
  [k: string]: unknown
}

export interface OutputSchema {
  accessJwt: string
  refreshJwt: string
  handle: string
  did: string
  [k: string]: unknown
}

export interface CallOptions {
  headers?: Headers
  qp?: QueryParams
  encoding: 'application/json'
}

export interface Response {
  success: boolean
  headers: Headers
  data: OutputSchema
}

export class InvalidHandleError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message)
  }
}

export class InvalidPasswordError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message)
  }
}

export class InvalidInviteCodeError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message)
  }
}

export class HandleNotAvailableError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message)
  }
}

export class UnsupportedDomainError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message)
  }
}

export class UnresolvableDidError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message)
  }
}

export class IncompatibleDidDocError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message)
  }
}

export enum ErrorName {
  InvalidHandle = 'InvalidHandle',
  InvalidPassword = 'InvalidPassword',
  InvalidInviteCode = 'InvalidInviteCode',
  HandleNotAvailable = 'HandleNotAvailable',
  UnsupportedDomain = 'UnsupportedDomain',
  UnresolvableDid = 'UnresolvableDid',
  IncompatibleDidDoc = 'IncompatibleDidDoc',
}

export function toKnownErr(e: any) {
  if (e instanceof XRPCError) {
    if (e.error === ErrorName.InvalidHandle) return new InvalidHandleError(e)
    if (e.error === ErrorName.InvalidPassword)
      return new InvalidPasswordError(e)
    if (e.error === ErrorName.InvalidInviteCode)
      return new InvalidInviteCodeError(e)
    if (e.error === ErrorName.HandleNotAvailable)
      return new HandleNotAvailableError(e)
    if (e.error === ErrorName.UnsupportedDomain)
      return new UnsupportedDomainError(e)
    if (e.error === ErrorName.UnresolvableDid)
      return new UnresolvableDidError(e)
    if (e.error === ErrorName.IncompatibleDidDoc)
      return new IncompatibleDidDocError(e)
  }
  return e
}
