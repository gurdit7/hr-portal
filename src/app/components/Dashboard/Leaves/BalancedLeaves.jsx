'use client'
import React, { useEffect, useState } from 'react';
import Wrapper from '../../Ui/Wrapper/Wrapper';
import { LeaveSummaryCard } from './Leaves';
import useAuth from '@/app/contexts/Auth/auth';

const BalancedLeaves = () => {
  const [user,setUser] = useState(false);
  const { userData } = useAuth();
  useEffect(()=>{
    setUser(userData);
  },[userData])
  return (
    <Wrapper>
    <Wrapper className="flex justify-between gap-[15px]">
    <LeaveSummaryCard
      title="Balance Leaves"
      count={user?.balancedLeaves || 12}
    />
    <LeaveSummaryCard
      title="Paid Leaves Taken"
      count={user?.totalLeaveTaken || 0}
    />
     {user?.totalUnpaidLeaveTaken !== 0 && (
     <LeaveSummaryCard
     className="border border-red-600"
      title="Unpaid Leaves Taken"
      count={user?.totalUnpaidLeaveTaken || 4}
      tooltip="Employees are granted four extra leave days annually, one per quarter, strategically aligned with weekends or public holidays."
    />
  )}
    <LeaveSummaryCard
      title="Balance Sandwich Leaves"
      count={user?.balancedSandwichLeaves || 4}
      tooltip="Employees are granted four extra leave days annually, one per quarter, strategically aligned with weekends or public holidays."
    />
   
    <LeaveSummaryCard
      title="Sandwich Leaves Taken"
      count={user?.balancedSandwichLeavesTaken || 0}
    />
   {user?.unpaidSandwichLeavesTaken !== 0 && (
     <LeaveSummaryCard
     className="border border-red-600"
      title="Unpaid Sandwich Taken"
      count={(user?.unpaidSandwichLeavesTaken) || 4}      
    />
  )}

    </Wrapper>
  </Wrapper>
  );
}

export default BalancedLeaves;
