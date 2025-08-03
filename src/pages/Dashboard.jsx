import React from 'react'

function Dashboard() {
  return (
    <div>
      <h1 className='text-light'>Dashboard</h1>
      <div style={{ color: 'white' }}>
  {Array.from({ length: 120 }, (_, i) => (
    <p key={i}>Row #{i + 1} — Sample white-colored scrolling data</p>
  ))}
</div>


    </div>
  )
}

export default Dashboard
