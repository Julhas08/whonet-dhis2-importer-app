import { createHash } from 'crypto'

/**
 * @param {String} patientId / registration no
 * @returns {String} Hashed patientId with sha512.
 */
export const hash = patientId =>
    createHash('sha512')
        .update(patientId)
		.digest('hex')