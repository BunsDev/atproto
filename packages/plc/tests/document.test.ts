import { check, cidForCbor } from '@atproto/common'
import { EcdsaKeypair, parseDidKey, Secp256k1Keypair } from '@atproto/crypto'
import * as uint8arrays from 'uint8arrays'
import * as data from '../src/lib/data'
import * as document from '../src/lib/document'
import * as operations from '../src/lib/operations'
import * as t from '../src/lib/types'

describe('plc DID document', () => {
  const ops: t.Operation[] = []

  let signingKey: Secp256k1Keypair
  let rotationKey1: Secp256k1Keypair
  let rotationKey2: EcdsaKeypair
  let did: string
  let handle = 'alice.example.com'
  let atpPds = 'https://example.com'

  let oldSigningKey: EcdsaKeypair
  let oldRecoveryKey: Secp256k1Keypair

  beforeAll(async () => {
    signingKey = await Secp256k1Keypair.create()
    rotationKey1 = await Secp256k1Keypair.create()
    rotationKey2 = await EcdsaKeypair.create()
  })

  it('creates a valid create op', async () => {
    const createOp = await operations.signOperation(
      {
        signingKey: signingKey.did(),
        rotationKeys: [rotationKey1.did(), rotationKey2.did()],
        handles: [handle],
        services: {
          atpPds,
        },
        prev: null,
      },
      signingKey,
    )
    const isValid = check.is(createOp, t.def.operation)
    expect(isValid).toBeTruthy()
    ops.push(createOp)
    did = await operations.didForCreateOp(createOp)
  })

  it('parses an operation log with no updates', async () => {
    const docData = await data.validateOperationLog(did, ops)

    expect(docData.did).toEqual(did)
    expect(docData.signingKey).toEqual(signingKey.did())
    expect(docData.).toEqual(recoveryKey.did())
    expect(docData.handle).toEqual(handle)
    expect(docData.atpPds).toEqual(atpPds)
  })

  // it('allows for updating handle', async () => {
  //   handle = 'ali.example2.com'
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op = await operations.updateHandle(
  //     handle,
  //     prev.toString(),
  //     signingKey,
  //   )
  //   ops.push(op)

  //   const doc = await document.validateOperationLog(did, ops)
  //   expect(doc.did).toEqual(did)
  //   expect(doc.signingKey).toEqual(signingKey.did())
  //   expect(doc.recoveryKey).toEqual(recoveryKey.did())
  //   expect(doc.handle).toEqual(handle)
  //   expect(doc.atpPds).toEqual(atpPds)
  // })

  // it('allows for updating atpPds', async () => {
  //   atpPds = 'https://example2.com'
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op = await operations.updateAtpPds(
  //     atpPds,
  //     prev.toString(),
  //     signingKey,
  //   )
  //   ops.push(op)

  //   const doc = await document.validateOperationLog(did, ops)
  //   expect(doc.did).toEqual(did)
  //   expect(doc.signingKey).toEqual(signingKey.did())
  //   expect(doc.recoveryKey).toEqual(recoveryKey.did())
  //   expect(doc.handle).toEqual(handle)
  //   expect(doc.atpPds).toEqual(atpPds)
  // })

  // it('allows for rotating signingKey', async () => {
  //   const newSigningKey = await EcdsaKeypair.create()
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op = await operations.rotateSigningKey(
  //     newSigningKey.did(),
  //     prev.toString(),
  //     signingKey,
  //   )
  //   ops.push(op)
  //   oldSigningKey = signingKey
  //   signingKey = newSigningKey

  //   const doc = await document.validateOperationLog(did, ops)
  //   expect(doc.did).toEqual(did)
  //   expect(doc.signingKey).toEqual(signingKey.did())
  //   expect(doc.recoveryKey).toEqual(recoveryKey.did())
  //   expect(doc.handle).toEqual(handle)
  //   expect(doc.atpPds).toEqual(atpPds)
  // })

  // it('no longer allows operations from old signing key', async () => {
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op = await operations.updateHandle(
  //     'bob',
  //     prev.toString(),
  //     oldSigningKey,
  //   )
  //   expect(document.validateOperationLog(did, [...ops, op])).rejects.toThrow()
  // })

  // it('allows for rotating recoveryKey', async () => {
  //   const newRecoveryKey = await Secp256k1Keypair.create()
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op = await operations.rotateRecoveryKey(
  //     newRecoveryKey.did(),
  //     prev.toString(),
  //     signingKey,
  //   )
  //   ops.push(op)
  //   oldRecoveryKey = recoveryKey
  //   recoveryKey = newRecoveryKey

  //   const doc = await document.validateOperationLog(did, ops)
  //   expect(doc.did).toEqual(did)
  //   expect(doc.signingKey).toEqual(signingKey.did())
  //   expect(doc.recoveryKey).toEqual(recoveryKey.did())
  //   expect(doc.handle).toEqual(handle)
  //   expect(doc.atpPds).toEqual(atpPds)
  // })

  // it('no longer allows operations from old recovery key', async () => {
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op = await operations.updateHandle(
  //     'bob',
  //     prev.toString(),
  //     oldRecoveryKey,
  //   )
  //   expect(document.validateOperationLog(did, [...ops, op])).rejects.toThrow()
  // })

  // it('it allows recovery key to rotate signing key', async () => {
  //   const newKey = await EcdsaKeypair.create()
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op = await operations.rotateSigningKey(
  //     newKey.did(),
  //     prev.toString(),
  //     recoveryKey,
  //   )
  //   ops.push(op)
  //   signingKey = newKey
  //   const doc = await document.validateOperationLog(did, ops)
  //   expect(doc.signingKey).toEqual(newKey.did())
  // })

  // it('it allows recovery key to rotate recovery key', async () => {
  //   const newKey = await Secp256k1Keypair.create()
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op = await operations.rotateRecoveryKey(
  //     newKey.did(),
  //     prev.toString(),
  //     recoveryKey,
  //   )
  //   ops.push(op)
  //   recoveryKey = newKey
  //   const doc = await document.validateOperationLog(did, ops)
  //   expect(doc.recoveryKey).toEqual(newKey.did())
  // })

  // it('it allows recovery key to update handle', async () => {
  //   handle = 'ally.example3.com'
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op = await operations.updateHandle(
  //     handle,
  //     prev.toString(),
  //     recoveryKey,
  //   )
  //   ops.push(op)
  //   const doc = await document.validateOperationLog(did, ops)
  //   expect(doc.handle).toEqual(handle)
  // })

  // it('it allows recovery key to update atpPds', async () => {
  //   atpPds = 'https://example3.com'
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op = await operations.updateAtpPds(
  //     atpPds,
  //     prev.toString(),
  //     recoveryKey,
  //   )
  //   ops.push(op)
  //   const doc = await document.validateOperationLog(did, ops)
  //   expect(doc.atpPds).toEqual(atpPds)
  // })

  // it('requires operations to be in order', async () => {
  //   const prev = await cidForCbor(ops[ops.length - 2])
  //   const op = await operations.updateAtpPds(
  //     'foobar.com',
  //     prev.toString(),
  //     signingKey,
  //   )
  //   expect(document.validateOperationLog(did, [...ops, op])).rejects.toThrow()
  // })

  // it('does not allow a create operation in the middle of the log', async () => {
  //   const op = await operations.create(
  //     signingKey,
  //     recoveryKey.did(),
  //     handle,
  //     atpPds,
  //   )
  //   expect(document.validateOperationLog(did, [...ops, op])).rejects.toThrow()
  // })

  // it('requires that the log start with a create operation', async () => {
  //   const rest = ops.slice(1)
  //   expect(document.validateOperationLog(did, rest)).rejects.toThrow()
  // })

  // it('formats a valid DID document', async () => {
  //   const data = await document.validateOperationLog(did, ops)
  //   const doc = await document.formatDidDoc(data)
  //   expect(doc['@context']).toEqual([
  //     'https://www.w3.org/ns/did/v1',
  //     'https://w3id.org/security/suites/ecdsa-2019/v1',
  //     'https://w3id.org/security/suites/secp256k1-2019/v1',
  //   ])
  //   expect(doc.id).toEqual(did)
  //   expect(doc.alsoKnownAs).toEqual([`https://${handle}`])

  //   expect(doc.verificationMethod.length).toBe(2)
  //   expect(doc.verificationMethod[0].id).toEqual('#signingKey')
  //   expect(doc.verificationMethod[0].type).toEqual(
  //     'EcdsaSecp256r1VerificationKey2019',
  //   )
  //   expect(doc.verificationMethod[0].controller).toEqual(did)
  //   const parsedSigningKey = parseDidKey(signingKey.did())
  //   const signingKeyMultibase =
  //     'z' + uint8arrays.toString(parsedSigningKey.keyBytes, 'base58btc')
  //   expect(doc.verificationMethod[0].publicKeyMultibase).toEqual(
  //     signingKeyMultibase,
  //   )
  //   expect(doc.verificationMethod[1].id).toEqual('#recoveryKey')
  //   expect(doc.verificationMethod[1].type).toEqual(
  //     'EcdsaSecp256k1VerificationKey2019',
  //   )
  //   expect(doc.verificationMethod[1].controller).toEqual(did)
  //   const parsedRecoveryKey = parseDidKey(recoveryKey.did())
  //   const recoveryKeyMultibase =
  //     'z' + uint8arrays.toString(parsedRecoveryKey.keyBytes, 'base58btc')
  //   expect(doc.verificationMethod[1].publicKeyMultibase).toEqual(
  //     recoveryKeyMultibase,
  //   )

  //   expect(doc.assertionMethod).toEqual(['#signingKey'])
  //   expect(doc.capabilityInvocation).toEqual(['#signingKey'])
  //   expect(doc.capabilityDelegation).toEqual(['#signingKey'])
  //   expect(doc.service.length).toBe(1)
  //   expect(doc.service[0].id).toEqual('#atpPds')
  //   expect(doc.service[0].type).toEqual('AtpPersonalDataServer')
  //   expect(doc.service[0].serviceEndpoint).toEqual(atpPds)
  // })

  // it('formats a valid DID document regardless of leading https://', async () => {
  //   handle = 'https://alice.example.com'
  //   const prev = await cidForCbor(ops[ops.length - 1])
  //   const op1 = await operations.updateHandle(
  //     handle,
  //     prev.toString(),
  //     signingKey,
  //   )
  //   atpPds = 'example.com'
  //   const prev2 = await cidForCbor(op1)
  //   const op2 = await operations.updateAtpPds(
  //     atpPds,
  //     prev2.toString(),
  //     signingKey,
  //   )
  //   ops.push(op1)
  //   ops.push(op2)
  //   const data = await document.validateOperationLog(did, ops)
  //   const doc = await document.formatDidDoc(data)
  //   expect(doc.alsoKnownAs).toEqual([handle])
  //   expect(doc.service[0].serviceEndpoint).toEqual(`https://${atpPds}`)
  // })
})
