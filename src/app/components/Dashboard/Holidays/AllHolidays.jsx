'use client';
import React, { useEffect, useState } from 'react';
import Wrapper from '../../Ui/Wrapper/Wrapper';

const AllHolidays = () => {
    const [holidays, setHolidays] = useState(false);
    useEffect(() => {
        fetch("/api/dashboard/holidays")
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            setHolidays(res);
          });
      }, []);
  return (
    <div>
       {holidays && (
        <Wrapper>
          <Wrapper className="flex bg-dark-blue">
            <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white max-w-20">
              S.no
            </Wrapper>
            <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
              Date
            </Wrapper>
            <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
              Festival
            </Wrapper>
            <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-white">
              Day
            </Wrapper>
          </Wrapper>
          <Wrapper className="border border-light-500 border-t-0">
            {holidays &&
              holidays.map((item, i) => (
                <Wrapper
                  key={i}
                  className={` flex items-center ${i} ${
                    i > 0 ? "border-t border-light-500" : ""
                  }`}
                >
                  <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize max-w-20">
                    {i + 1}
                  </Wrapper>
                  <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                    {item.date}
                  </Wrapper>
                  <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                    {item.festival}
                  </Wrapper>
                  <Wrapper className="flex-1 text-sm font-medium font-poppins p-[10px] text-text-dark capitalize">
                    {item.day}
                  </Wrapper>
                </Wrapper>
              ))}
          </Wrapper>
        </Wrapper>
      )}
    </div>
  );
}

export default AllHolidays;
