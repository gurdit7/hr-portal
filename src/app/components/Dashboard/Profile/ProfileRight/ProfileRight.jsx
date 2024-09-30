"use client";

import FormButton from "@/app/components/Form/FormButton/FormButton";
import IconView from "@/app/components/Icons/IconView";
import H2 from "@/app/components/Ui/H2/H2";
import Text from "@/app/components/Ui/Text/Text";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import SkeletonLoader from "@/app/components/Ui/skeletonLoader/skeletonLoader";
import useAuth from "@/app/contexts/Auth/auth";
import { formatDate } from "@/app/utils/DateFormat";
import { PriceFormatter } from "@/app/utils/PriceFormatter";
import Link from "next/link";
import { useState } from "react";

const ProfileRight = ({ heading, button }) => {
  const [view, setView] = useState(false);
  const { userData } = useAuth();
  return (
    <Wrapper className="p-5 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-[10px] flex flex-col w-full">
      <H2>{heading}</H2>
      <Wrapper className="mt-[15px]">
        <Wrapper className="py-[10px] border-t border-b dark:border-gray-600 border-light-500 flex justify-between gap-x-4">
          <Text className="!text-light-400 flex-1">Current Salary</Text>

          <Wrapper className="flex items-center gap-1 justify-end">
            {!view && (
              <svg width="118" height="8" viewBox="0 0 118 8" fill="none">
                <ellipse
                  cx="4.17009"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
                <ellipse
                  cx="15.2021"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
                <ellipse
                  cx="26.2341"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
                <ellipse
                  cx="37.266"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
                <ellipse
                  cx="48.298"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
                <ellipse
                  cx="59.33"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
                <ellipse
                  cx="70.362"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
                <ellipse
                  cx="81.394"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
                <ellipse
                  cx="92.4259"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
                <ellipse
                  cx="103.458"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
                <ellipse
                  cx="114.49"
                  cy="4"
                  rx="3.51017"
                  ry="3.5"
                  fill="#C2C3CB"
                />
              </svg>
            )}
            {view && (
              <span className="text-sm dark:!text-white">
                {PriceFormatter.format(userData?.currentSalary) || "Not Added Yet"}
              </span>
            )}
            <button onClick={() => setView((prevState) => !prevState)}>
              {!view && <IconView size={"18px"} color={"fill-light-400"} />}
              {view && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.2505 16.6301C12.4381 16.8401 11.5957 16.9401 10.7232 16.9401C7.44367 16.9401 4.50516 15.4101 2.49934 12.9901C1.09527 11.3001 1.09527 8.69006 2.49934 7.01006C2.65981 6.81006 2.84033 6.62005 3.02085 6.43005"
                    stroke="#C2C3CB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.947 12.9901C18.1447 13.9501 17.192 14.7701 16.1389 15.4101L5.29749 4.59006C6.89211 3.61006 8.73746 3.06006 10.7232 3.06006C14.0027 3.06006 16.9412 4.59006 18.947 7.01006C20.3511 8.69006 20.3511 11.3101 18.947 12.9901Z"
                    stroke="#C2C3CB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.8122 10C13.8122 10.85 13.4611 11.62 12.9095 12.18L8.53687 7.82005C9.08846 7.26005 9.87073 6.92004 10.7232 6.92004C12.4382 6.92004 13.8122 8.29005 13.8122 10Z"
                    stroke="#C2C3CB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.44629 0.75L5.29745 4.59L8.53684 7.82L12.9095 12.18L16.1489 15.41L20.0001 19.25"
                    stroke="#C2C3CB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </Wrapper>
        </Wrapper>
        <Wrapper className="py-[10px] border-b dark:border-gray-600 border-light-500 flex justify-between">
          <Text className="!text-light-400 flex-1">Increment Date</Text>
          {!userData && <SkeletonLoader className="!w-1/2 rounded-2xl !h-3" />}
          {userData && (
            <Text className="flex-1 text-right capitalize">
              {formatDate(userData?.incrementDate)}
            </Text>
          )}
        </Wrapper>
      </Wrapper>
      {button && (
        <Wrapper className="mt-[15px] flex justify-center">
          <Link
            href="/dashboard/salary"
            className="max-w-[250px] mx-auto flex items-center justify-center min-h-[54px]  before:absolute before:bottom-0 overflow-hidden relative before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-accent before:transition-all before:duration-500 hover:text-white hover:shadow-accent hover:before:left-0 hover:before:w-full border border-accent w-full text-accent px-12  rounded-lg text-base font-poppins font-medium py-[10px]  "
          >
            <span className="relative z-10">Appraisal Form</span>
          </Link>
        </Wrapper>
      )}
    </Wrapper>
  );
};

export default ProfileRight;
