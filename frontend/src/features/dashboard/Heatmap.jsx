import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'

const localDate = (isoDate) => new Date(`${isoDate}T12:00:00`)

export default function Heatmap({ values }) {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 364)
  const entries = values.map((entry) => ({ ...entry, date: localDate(entry.date) }))

  return (
    <div className="heatmap-wrap">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={entries}
        classForValue={(value) => {
          if (!value || !value.count) return 'color-scale-0'
          if (value.count >= 6) return 'color-scale-4'
          if (value.count >= 4) return 'color-scale-3'
          if (value.count >= 2) return 'color-scale-2'
          return 'color-scale-1'
        }}
        titleForValue={(value) => value ? `${value.count} ${value.count === 1 ? 'problem' : 'problems'} · ${value.date.toLocaleDateString()}` : 'No problems logged'}
      />
      <div className="heatmap-legend"><span>Less</span><i className="color-scale-0" /><i className="color-scale-1" /><i className="color-scale-2" /><i className="color-scale-3" /><i className="color-scale-4" /><span>More</span></div>
    </div>
  )
}
