const urlCalender = "/tracker/calender"
const urlDaily = "/tracker/daily"
const calenderIcon = document.querySelector('.calender-icon')
const ul = document.querySelector('.major-content')
const container = document.querySelector('.container')


// query data from remote server & render calender
if (calenderIcon) {
  calenderIcon.addEventListener('click', event => {
    axios
      .get(urlCalender)
      .then(res => {
        const datas = [...res.data]
        const month = datas.pop()
        const year = datas.pop()
        const prefixContent = calculateCalenderPrefix(year, month)
        const calenderContent = subTotals(year, month, ...datas)
        ul.innerHTML = ''
        ul.innerHTML = calenderBasicHtml(prefixContent, calenderContent, year, month)
      })
      .catch(err => console.log(err))
  })
}

// listen to calender month or year change
if (ul) {
  ul.addEventListener('click', event => {
    let yearInput = ''
    let monthInput = ''
    let year = 0
    let month = 0
    let target = event.target
    if (target.classList.contains('year-btn') || target.classList.contains('month-btn')) {
      yearInput = document.querySelector('.year')
      monthInput = document.querySelector('.month')
      year = Number(yearInput.value)
      month = Number(monthInput.value)
    } else {
      return
    }
    if (target.classList.contains('year-btn')) {
      if (target.classList.contains('fa-chevron-left')) {
        year = year - 1
      } else {
        year = year + 1
      }
    } else if (target.classList.contains('month-btn')) {
      if (target.classList.contains('fa-chevron-left')) {
        month = month - 1
      } else {
        month = month + 1
      }
    }
    axios
      .get(urlCalender + `?year=${year}&month=${month}`)
      .then(res => {
        const datas = [...res.data]
        const month = datas.pop()
        const year = datas.pop()
        const prefixContent = calculateCalenderPrefix(year, month)
        const calenderContent = subTotals(year, month, ...datas)
        ul.innerHTML = ''
        ul.innerHTML = calenderBasicHtml(prefixContent, calenderContent, year, month)
      })
      .catch(err => console.log(err))
    })
}

// listen to daily expense
if (ul) {
  ul.addEventListener('click', event => {
    let target = event.target
    if (target.classList.contains('daily-subTotal')) {
      const date = target.dataset.id
      axios
        .get(urlDaily + "/" + date)
        .then(res => {
          const data = res.data
          const dailyModal = createModal(...data)
          const modalBox = document.createElement('div')
          modalBox.innerHTML = dailyModal
          modalBox.classList = 'modal-box'
          container.insertAdjacentElement('afterbegin', modalBox)
        })
        .then(() => {
          const modal = document.querySelector('.modal-box')
          modal.addEventListener('click', event => {
            let target = event.target
            if (target.classList.contains('close') || target.classList.contains('close-btn')) {
              modal.remove()
            }
          })
        })
    }
  })
}

// calculate daily subtotal in calender
function subTotals (year, month, ...datas) {
  const day = new Date(year, month, 0)
  const totalDays = day.getDate()
  let calenderList = ''
  for (let i = 1; i <= totalDays; i++) {
    let subAmount = 0
    subAmount = datas.reduce((total, item) => {
      return i === Number(item.date.split("T")[0].split("-")[2])? total += item.amount: total
    }, 0)
    if (subAmount) {
      calenderList += `
        <li class="weekday">
          <h6 class="calender-day">${i}</h6>
          <p data-id="${year}-${month}-${i}" class="daily-subTotal">支出 : ${subAmount}</p>
        </li>
      `
    } else {
      calenderList += `
        <li class="weekday">
          <h6 class="calender-day">${i}</h6>
        </li>
      `
    }
  }
  return calenderList
}

// calculate & fill up empty space before calender day start
function calculateCalenderPrefix (year,  month) {
  const firstDay = new Date(year, month - 1, 1)
  const weekday = firstDay.getDay() 
  let prefix = ''
  if (!weekday) {
    return prefix
  } else {
    for (let i = 0; i < weekday; i++) {
      prefix += `
        <li class="weekday"></li>
      `
    }
    return prefix
  }
}

// aggregate all calender elements
function calenderBasicHtml (htmlOne, htmlTwo, year, month) {
  let calenderHeader = `
    <div class="calender-slideBox">
      <div class="year-box">
        <button type="button" class="btn-left-arrow"><i class="fas fa-chevron-left year-btn year-left-arrow"></i></button>
        <input type="number" name="year" value="${year}" class="year" readonly="readonly">
        <button type="button" class="btn-right-arrow"><i class="fas fa-chevron-right year-btn year-right-arrow"></i></button>
      </div>
      <div class="month-box">
        <button type="button" class="btn-left-arrow"><i class="fas fa-chevron-left month-btn month-left-arrow"></i></button>
        <input type="number" name="month" value="${month}" class="month" readonly="readonly">
        <button type="button" class="btn-right-arrow"><i class="fas fa-chevron-right month-btn month-right-arrow"></i></button>
      </div>
    </div>
    <div class="calender-box">
      <ul class="weekday-title">
        <li class="weekday">Sunday</li>
        <li class="weekday">Monday</li>
        <li class="weekday">Tuesday</li>
        <li class="weekday">Wednesday</li>
        <li class="weekday">Thursday</li>
        <li class="weekday">Friday</li>
        <li class="weekday">Saturday</li>
      </ul>
      <ul class="daily-box">
      ${htmlOne}
      ${htmlTwo}
      </ul>
    </div>
  `
  return calenderHeader
}

// create modal
function createModal(...data) {
  let detailList = ''
  data.forEach(item => {
    detailList += `
    <div class="list-details">
      <div class="list-name-date">
        <span class="list-title">${item.name}</span>
        <span class="list-date">${item.date}</span>
      </div>
      <div class="list-merchant">
        <span class="list-merchant-text">${item.merchant}</span>
      </div>
      <div class="list-amount">
        <span class="list-amount-dollar">${item.amount}</span>
      </div>
    </div>
    `
  })
  const modalHtml = `
              <div class="modal-sub">
                <div class="modal-header">
                  <h5 class="modal-title">Details of Expense</h5>
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                  ${detailList}
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default close-btn" data-dismiss="modal">Close</button>
                </div>
              </div>
          `
  
  return modalHtml
}