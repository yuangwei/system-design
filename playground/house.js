class HouseLoan {
  constructor(
    value, // 房产购买时价值
    firstPay, // 贷款首付
    fee, // 入住前的总费用
    rate, // 固定贷款利率
  ) {
    this.value = value;
    this.firstPay = firstPay;
    this.fee = fee;
    this.rate = rate;
  }

  getMonth(area) {
    let [sy, sm] = area[0].split('.'), [ey, em] = area[1].split('.')
    return Math.floor(ey - sy) * 12 + (em - sm)
  }

  /**
   * 持有所花费的总成本
   * @param {*} area eg. 2019.1 - 2022.1
   */
  handleTotal(area, rate, monthReturn, lease) {
    const m = this.getMonth(area)
    const [lx] = HouseLoan.loan(this.value - this.firstPay, m, monthReturn, this.rate)
    const inlx = HouseLoan.invest(this.firstPay + this.fee, m, rate)
    const f = this.fee + inlx + lx - (lease * m)
    return Math.floor(f)
  }
}


// 房贷 
HouseLoan.loan = function (total, month, m, r) {
  let cur = 0
  let clx = 0
  r = r / 12
  for (let i = 1; i <= month; i++) {
    let lx = Math.floor((total - cur) * r)
    cur += Math.floor(m - lx)
    clx += lx
  }
  return [clx, total - cur]
}

// 投资收益计算
HouseLoan.invest = function (total, month, r) {
  let lx = 0, t = total
  for (let i = 1; i <= month; i++) {
    lx = (t * (r / 12))
    t = Math.floor(t + lx)
  }
  return Math.floor(lx)
}

const wyaHouse = new HouseLoan(2080000, 730000, (20800 + 49000 + 170000 + 10000), 0.049)

const cb = wyaHouse.handleTotal(['2019.8', '2023.12'], 0.031, 7164, 3000)
console.log('2019.8 - 2023.12, 持有成本: %s, 总成本 %s', cb, 2080000 + cb)
