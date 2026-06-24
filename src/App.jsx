import { useState, useMemo } from 'react'
import Header from './components/Header'
import NotificationList from './components/NotificationList'
import rawNotifications from './data/notifications'

function parseDate(dateStr) {
  const [dd, mm, yyyy] = dateStr.split('.')
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd))
}

const notifications = [...rawNotifications].sort(
  (a, b) => parseDate(b.date) - parseDate(a.date)
)

const PAGE_SIZE = 20

export default function App() {
  const [query, setQuery] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterDay, setFilterDay] = useState('')
  const [page, setPage] = useState(1)

  const years = useMemo(() => {
    const set = new Set(notifications.map(n => n.date.split('.')[2]))
    return [...set].sort((a, b) => b - a)
  }, [])

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const [dd, mm, yyyy] = n.date.split('.')
      if (filterYear && yyyy !== filterYear) return false
      if (filterMonth && mm !== filterMonth) return false
      if (filterDay && dd !== filterDay) return false
      if (query && !n.text.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [query, filterYear, filterMonth, filterDay])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goTo(p) { setPage(p) }
  function resetPage() { setPage(1) }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <NotificationList
          notifications={paginated}
          total={filtered.length}
          page={page}
          totalPages={totalPages}
          goTo={goTo}
          query={query}
          setQuery={q => { setQuery(q); resetPage() }}
          filterYear={filterYear}
          setFilterYear={y => { setFilterYear(y); resetPage() }}
          filterMonth={filterMonth}
          setFilterMonth={m => { setFilterMonth(m); resetPage() }}
          filterDay={filterDay}
          setFilterDay={d => { setFilterDay(d); resetPage() }}
          years={years}
          pageSize={PAGE_SIZE}
        />
      </main>
      <footer className="footer">
        <p>© KLS Gogte Institute of Technology — Examination Section</p>
      </footer>
    </div>
  )
}
