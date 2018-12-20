function parse (input) {
  return input.reduce(
    (acc, val) => {
      if (val.startsWith('@')) {
        var re = /(?<=\[).*?(?=\])/gm
        let list = []
        var m
        do {
          m = re.exec(val)
          if (m) list.push(m[0])
        } while (m)
        acc.info.push({ name: list[0], data: list.splice(1) })
      } else acc.data += (acc.data.length > 0 ? '\n' : '') + val
      return acc
    },
    { data: '', info: [] }
  )
}

module.exports = { parse }
