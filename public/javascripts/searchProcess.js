const searchContainer = document.querySelector('.search-container')
const monthInput = document.querySelector('.month-filter')
const categoryInput = document.querySelector('.category-filter')
const total = document.querySelector('.total')
const expenseList = document.querySelector('.total-lists')
if (searchContainer) {
  searchContainer.addEventListener('change', event => {
    const month = monthInput.value
    const category = categoryInput.value
    const dataRequestUrl = `https://shielded-eyrie-64965.herokuapp.com/search?month=${month}&category=${category}`
    // const dataRequestUrl = `/tracker/search?month=${month}&category=${category}`
    axios
    .get(dataRequestUrl)
    .then(res => {
      const [result, category] = [...res.data]
      result.forEach(item => {
        item.icon = iconSelect(item, ...category)
        item.date = item.date.slice(0, 10)
      })
      const amount = formatNumber(totalAmount(...result))
      total.innerHTML = `
      <div class="total-amount">
        <span class="total-amount-number">總金額 : <i class="fas fa-dollar-sign"></i>${amount}</span>
      </div>
      `
      expenseList.innerHTML = expenseContent(...result)
    })
    .catch(err => console.log(err))
  })
}

function iconSelect (record, ...categories) {
  const target = categories.filter(item => item.id === record.category)
  return target[0].icon
}

function totalAmount (...records) {
  return records.reduce((total, item) => {
    return total += item.amount
  }, 0)
}

function formatNumber (amount) {
  return amount.toLocaleString('en-US')
}

function expenseContent (...result) {
  return result.reduce((result, item, index) => {
    const className = 'a' + index % 2
    return result += `
    <div class="list ${className}">
    <div class="list-details">
      <div class="list-content">
        ${item.icon}
      </div>
      <div class="list-name-date">
        <span class="list-title">${item.name}</span>
        <span class="list-date">${item.date}</span>
      </div>
      <div class="list-amount">
        <span class="list-amount-dollar">${item.amount}</span>
      </div>
    </div>
    <div class="list-merchant">
      <span class="list-merchant-text">${item.merchant}</span>
    </div>
    <div class="list-button">
      <a href="/tracker/${item._id}" class="edit"><button type="submit" class="list-edit btn btn-secondary" ><i class="fas fa-pencil-alt"></i>編輯</button></a>
      <button type="button" class="list-delete btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-item${item._id}"><i class="fas fa-trash-alt"></i>刪除</button>
      <div class="modal fade" id="delete-item${item._id}" tabindex="-1" aria-labelledby="delete-item" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ModalLabel">注意! 此操作將會刪除資料</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-footer">
              <form action="/tracker/${item._id}?_method=DELETE" method="post">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-undo"></i>返回</button>
                <button type="submit" class="btn btn-danger"><i class="fas fa-trash-alt"></i>確認刪除</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `
  }, '')
}