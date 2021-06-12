const url = "http://localhost:3000/data"
const button = document.querySelector('.pie-chart')

function label (...categories) {
  let labels = []
  for (let i of categories) {
    labels.push(i.name)
  }
  return labels
}

function subTotal(data, ...records) {
  let amount = 0
  for (let i of records) {
    if (data.id === i.category) {
      amount += i.amount
    }
  }
  return amount
}

function getdata (url) {
  axios
    .get(url)
    .then(res => {
      records = res.data[0]
      categories = res.data[1]
      let labels = label(...categories)
      let subTotals = []
      for (let i of categories) {
        subTotals.push(subTotal(i, ...records))
      }
      const majorContent = document.querySelector('.major-content')
      majorContent.innerHTML = ''
      let myChart = document.createElement("canvas")
      majorContent.appendChild(myChart)
      let ctx = new Chart(myChart, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            // label: '費用分布',
            data: subTotals,
            backgroundColor: [
              'rgba(255, 99, 132, 0.4)',
              'rgba(54, 162, 235, 0.4)',
              'rgba(255, 206, 86, 0.4)',
              'rgba(75, 192, 192, 0.4)',
              'rgba(153, 102, 255, 0.4)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1,
            radius: '70%'
          }]
        },
      })
    })
    .catch(err => {
      console.log(err)
    })
}
  
button.addEventListener('click', event => {
  getdata(url)
})