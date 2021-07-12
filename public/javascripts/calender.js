const urlCalender = "/tracker/calender"
const calenderBtn = document.querySelector('.calender-period')

axios
  .get(urlCalender)
  .then(res => {
    console.log("🚀 ~ file: calender.js ~ line 6 ~ date", res.data)
  })
  .catch(err => console.log(err))
if (calenderBtn) {
  calenderBtn.addEventListener('click', event => {
    axios
      .get(urlCalender)
      .then(res => {
        console.log("🚀 ~ file: calender.js ~ line 6 ~ date", res)
      })
      .catch(err => console.log(err))
  })
}

// function arrangeCalenderDisplay (datas) {

// }