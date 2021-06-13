function validator (data) {
  const int = /^[1-5]$/
  const date = data.date.split("-")
  const year = /^[2][0][2][1]$/
  const month = /^[0-1][0-9]$/
  const day = /^[0-3][0-9]$/
  const categoryCheck = int.test(data.category)
  const dateCheck = year.test(date[0]) && month.test(date[1]) && date[1] <=12 && day.test(date[2]) && date[2] <=31
  const nameCheck = (data.name.length <= 100)
  const amountCheck = (Number(data.amount) > 0)
  return dateCheck && categoryCheck && nameCheck && amountCheck
}

module.exports = validator