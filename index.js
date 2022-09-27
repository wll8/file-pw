const fs = require(`fs`)
const crypto = require(`crypto`)
const lz = require(`lz-string`)
// const pw = `abc`
const pw = undefined

const filePath = `package.json`
const binary = fs.readFileSync(filePath)
const buffer = Buffer.from(binary)
const base64 = buffer.toString(`base64`)
const enBase64 = enSign(base64, md5(pw))
console.log(`buffer`, buffer)

// 压缩加密后的 base64
const compress = lz.compress(enBase64)
fs.writeFileSync(`./${filePath}.base64.pw.compress.txt`, compress, {encoding: `utf16le`})
const unCompress = lz.decompress(fs.readFileSync(`./${filePath}.base64.pw.compress.txt`, `utf16le`))

console.log(`===`, enBase64 === unCompress)

// 从 base64 还原为文件
let dataBuffer = Buffer.from(deSign(unCompress, md5(pw)), `base64`)
fs.writeFileSync(`./${filePath}.base64.to.file.${filePath}`, dataBuffer)


/**
 * 获取字符串 md5
 * @param {*} text 
 * @returns 
 */
function md5(text) {
  return text === undefined ? undefined : crypto.createHash('md5').update(text).digest('hex')
}

// 加密
function enSign(src, key, iv = key) {
  if(key === undefined) {
    return src
  }
  key = Buffer.from(key, 'utf8')
  iv = Buffer.from(iv.slice(0, 16), 'utf8')
  let sign = '';
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  sign += cipher.update(src, 'utf8', 'hex');
  sign += cipher.final('hex');
  return sign;
}

// 解密
function deSign(sign, key, iv = key) {
  if(key === undefined) {
    return sign
  }
  key = Buffer.from(key, 'utf8')
  iv = Buffer.from(iv.slice(0, 16), 'utf8')
  let src = '';
  const cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  src += cipher.update(sign, 'hex', 'utf8');
  src += cipher.final('utf8');
  return src;
}
