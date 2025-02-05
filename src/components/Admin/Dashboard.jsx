import React from 'react';
import { Component as SalesChart } from "@/components/Charts/SalesChart";
import { Component as LineChart } from "@/components/Charts/LineChart";
import { Component as PieChart } from "@/components/Charts/PieChart";

const Dashboard = () => {
  return (
    <>
      <div className='flex flex-col'>
        <div className='dashGraph flex flex-col lg:flex-row justify-around items-center gap-2'>
          <div className='w-full'>
            <SalesChart className="h-full"/>
          </div>
          <div className='w-full'>
            <LineChart/>
          </div>
          <div className='w-full'>
            <PieChart/>
          </div>
        </div>
        <div className='dashCnt'>
          Content
        </div>
      </div>
    </>
  )
}

export default Dashboard