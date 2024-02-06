function poundsToTons(pounds: number): number {
  const poundsPerTon = 2000
  return pounds / poundsPerTon
}

function tonsToPounds(tons: number): number {
  const poundsPerTon = 2000
  return tons * poundsPerTon
}

export { poundsToTons, tonsToPounds }
