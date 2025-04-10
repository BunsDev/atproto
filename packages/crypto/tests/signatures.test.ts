import fs from 'node:fs'
import * as uint8arrays from 'uint8arrays'
import { secp256k1 as nobleK256 } from '@noble/curves/secp256k1'
import { p256 as nobleP256 } from '@noble/curves/p256'
import EcdsaKeypair from '../src/p256/keypair'
import Secp256k1Keypair from '../src/secp256k1/keypair'
import * as p256 from '../src/p256/operations'
import * as secp from '../src/secp256k1/operations'
import { cborEncode } from '@atproto/common'
import {
  bytesToMultibase,
  multibaseToBytes,
  parseDidKey,
  P256_JWT_ALG,
  SECP256K1_JWT_ALG,
  sha256,
} from '../src'

describe('signatures', () => {
  let vectors: TestVector[]

  beforeAll(() => {
    vectors = JSON.parse(
      fs.readFileSync(`${__dirname}/signature-fixtures.json`).toString(),
    )
  })

  it('verifies secp256k1 and P-256 test vectors', async () => {
    for (const vector of vectors) {
      const messageBytes = uint8arrays.fromString(
        vector.messageBase64,
        'base64',
      )
      const signatureBytes = uint8arrays.fromString(
        vector.signatureBase64,
        'base64',
      )
      const keyBytes = multibaseToBytes(vector.publicKeyMultibase)
      const didKey = parseDidKey(vector.publicKeyDid)
      expect(uint8arrays.equals(keyBytes, didKey.keyBytes))
      if (vector.algorithm === P256_JWT_ALG) {
        const verified = await p256.verifySig(
          keyBytes,
          messageBytes,
          signatureBytes,
        )
        expect(verified).toEqual(vector.validSignature)
      } else if (vector.algorithm === SECP256K1_JWT_ALG) {
        const verified = await secp.verifySig(
          keyBytes,
          messageBytes,
          signatureBytes,
        )
        expect(verified).toEqual(vector.validSignature)
      } else {
        throw new Error('Unsupported test vector')
      }
    }
  })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function generateTestVectors(): Promise<TestVector[]> {
  const p256Key = await EcdsaKeypair.create({ exportable: true })
  const secpKey = await Secp256k1Keypair.create({ exportable: true })
  const messageBytes = cborEncode({ hello: 'world' })
  const messageBase64 = uint8arrays.toString(messageBytes, 'base64')
  return [
    {
      messageBase64,
      algorithm: P256_JWT_ALG, // "ES256" / ecdsa p-256
      publicKeyDid: p256Key.did(),
      publicKeyMultibase: bytesToMultibase(
        p256Key.publicKeyBytes(),
        'base58btc',
      ),
      signatureBase64: uint8arrays.toString(
        await p256Key.sign(messageBytes),
        'base64',
      ),
      validSignature: true,
    },
    {
      messageBase64,
      algorithm: SECP256K1_JWT_ALG, // "ES256K" / secp256k
      publicKeyDid: secpKey.did(),
      publicKeyMultibase: bytesToMultibase(
        secpKey.publicKeyBytes(),
        'base58btc',
      ),
      signatureBase64: uint8arrays.toString(
        await secpKey.sign(messageBytes),
        'base64',
      ),
      validSignature: true,
    },
    // these vectors test to ensure we don't allow high-s signatures
    {
      messageBase64,
      algorithm: P256_JWT_ALG, // "ES256" / ecdsa p-256
      publicKeyDid: p256Key.did(),
      publicKeyMultibase: bytesToMultibase(
        p256Key.publicKeyBytes(),
        'base58btc',
      ),
      signatureBase64: await makeHighSSig(
        messageBytes,
        await p256Key.export(),
        P256_JWT_ALG,
      ),
      validSignature: false,
    },
    {
      messageBase64,
      algorithm: SECP256K1_JWT_ALG, // "ES256K" / secp256k
      publicKeyDid: secpKey.did(),
      publicKeyMultibase: bytesToMultibase(
        secpKey.publicKeyBytes(),
        'base58btc',
      ),
      signatureBase64: await makeHighSSig(
        messageBytes,
        await secpKey.export(),
        SECP256K1_JWT_ALG,
      ),
      validSignature: false,
    },
  ]
}

async function makeHighSSig(
  msgBytes: Uint8Array,
  keyBytes: Uint8Array,
  alg: string,
): Promise<string> {
  const hash = await sha256(msgBytes)

  let sig: string | undefined
  do {
    if (alg === SECP256K1_JWT_ALG) {
      const attempt = await nobleK256.sign(hash, keyBytes, { lowS: false })
      if (attempt.hasHighS()) {
        sig = uint8arrays.toString(attempt.toCompactRawBytes(), 'base64')
      }
    } else {
      const attempt = await nobleP256.sign(hash, keyBytes, { lowS: false })
      if (attempt.hasHighS()) {
        sig = uint8arrays.toString(attempt.toCompactRawBytes(), 'base64')
      }
    }
  } while (sig === undefined)
  return sig
}

type TestVector = {
  algorithm: string
  publicKeyDid: string
  publicKeyMultibase: string
  messageBase64: string
  signatureBase64: string
  validSignature: boolean
}
