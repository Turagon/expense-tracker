const tools = {
  iconSelect (record, ...categories) {
    const target = categories.filter(item => item.id === record.category)
    return target[0].icon
  },

  totalAmount (...records) {
    return records.reduce((total, item) => {
      return total += item.amount
    }, 0)
  },

  formatNumber (amount) {
    return amount.toLocaleString('en-US')
  }
}

module.exports = tools