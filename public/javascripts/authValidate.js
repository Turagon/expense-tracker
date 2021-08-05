// 此檔案由於程式寫法變更 暫時不用 但仍然保留
function emailVerify(email) {
  const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
  return emailRule.test(email) ? true : false
}

function passwordVerify(password) {
  const number = '0123456789'
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const pass = password.split("")
  const numberCheck = pass.filter(item => number.includes(item))
  const lowerCaseCheck = pass.filter(item => lowerCase.includes(item))
  const upperCaseCheck = pass.filter(item => upperCase.includes(item))
  if (numberCheck.length && lowerCaseCheck.length && upperCaseCheck.length && password.length >= 6 && password.length <= 12) {
    return true
  } else {
    return false
  }
}

module.exports = { emailVerify, passwordVerify }