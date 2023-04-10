import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    "name": "0 AM",
    "Paid": 1000,
    "Sales": 3400
  },
  {
    "name": "6 AM",
    "Paid": 3000,
    "Sales": 1398
  },
  {
    "name": "12 PM",
    "Paid": 7000,
    "Sales": 9800
  },
  {
    "name": "6 PM",
    "Paid": 2780,
    "Sales": 3908
  },
  {
    "name": "12 AM",
    "Paid": 1890,
    "Sales": 4800
  }
]

export default class BarChart extends PureComponent {


  render() {
    return (

      <ResponsiveContainer className="absolute" width="100%" height="100%">
        <AreaChart height={250} data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>

            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FD171B" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FD171B" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#03A629" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#03A629" stopOpacity={0} />
            </linearGradient>

          </defs>
          <XAxis dataKey="name" />
          <YAxis padding={{ bottom: 15 }} />

          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="Paid" stroke="#FD171B" fillOpacity={1} fill="url(#colorUv)" />
          <Area type="monotone" dataKey="Sales" stroke="#03A629" fillOpacity={1} fill="url(#colorPv)" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
