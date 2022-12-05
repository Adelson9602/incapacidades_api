import CryptoJS from 'crypto-js'
import config from '../config'

const compareDataAES = (password: string, passwordEncryt: string) => {
  return new Promise<boolean>((resolve) => {
    if (encryptedAES(password) === passwordEncryt) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

const encryptedAES = (data: string):string => {
  const key = CryptoJS.HmacSHA1('sha256', config.SECRET_KEY)
  const iv = CryptoJS.HmacSHA1('sha256', config.IV)
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

const decryptedAES = (encrypted: string):string => {
  const key = CryptoJS.HmacSHA1('sha256', config.SECRET_KEY)
  const iv = CryptoJS.HmacSHA1('sha256', config.IV)
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

export {
  compareDataAES,
  encryptedAES,
  decryptedAES
}
