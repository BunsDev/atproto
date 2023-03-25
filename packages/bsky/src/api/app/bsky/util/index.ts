import express from 'express'
import { AuthRequiredError } from '@atproto/xrpc-server'

export const isEnum = <T extends { [s: string]: unknown }>(
  object: T,
  possibleValue: unknown,
): possibleValue is T[keyof T] => {
  return Object.values(object).includes(possibleValue)
}

// @TODO(lex) remove declaration, stubbed for now
export const getDeclarationSimple = (): Declaration => {
  return {
    actorType: '',
    cid: '',
  }
}

export type Declaration = { cid: string; actorType: string }

// @TODO(bsky) treating did as a bearer, just a placeholder for now.
export const authVerifier = (ctx: {
  req: express.Request
  res: express.Response
}) => {
  const { authorization = '' } = ctx.req.headers
  if (!authorization.startsWith('Bearer ')) {
    throw new AuthRequiredError()
  }
  const did = authorization.replace('Bearer ', '').trim()
  if (!did.startsWith('did:')) {
    throw new AuthRequiredError()
  }
  return { credentials: { did } }
}