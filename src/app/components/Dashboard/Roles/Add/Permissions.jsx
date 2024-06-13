"use client";
import Checkbox from "@/app/components/Form/Checkbox/Checkbox";
import Wrapper from "@/app/components/Ui/Wrapper/Wrapper";
import { rolesPermissions } from "@/app/data/default";
import { useEffect, useState } from "react";
const Permissions = ({ getFormData, selectedPermissions }) => {
  const [checkbox, setCheckbox] = useState({});
  const [accordions, setAccordions] = useState({});
  const [mainChecked, setMainChecked] = useState(false);
  const [mainCheckCount, setMainCheckCount] = useState({});
  const handleAccordion = (id) => {
    setAccordions((prev) => ({ ...prev,
      [id]: !accordions[id],
    }));
  };
  useEffect(()=>{
    const newMainCheck = {};
    Object.keys(rolesPermissions).forEach((value) => {
      newMainCheck[`${value}Wrapper`] = false;
    });
    setAccordions(newMainCheck);
  },[rolesPermissions])
  const handleExpandAll = () => {
    const newMainCheck = {};
    const expand = Object.values(accordions).every((v) => v);
    Object.keys(rolesPermissions).forEach((value) => {
      newMainCheck[`${value}Wrapper`] = !expand;
    });
    setAccordions(newMainCheck);
  };
  const handlePermissionsChange = (id, permissions) => (e) => {
    const checked = e.target.checked;
    const checkedAll = permissions.reduce((acc, perm, i) => {
      acc[`${id}_${i}`] = checked;
      return acc;
    }, {});
    const valuesAll = permissions.reduce((acc, perm, i) => {
      acc[perm.value] = checked;
      return acc;
    }, {});
    getFormData((prev) => ({ ...prev, ...valuesAll }));
    setCheckbox({ ...checkbox, ...checkedAll });
    setMainChecked({ ...mainChecked, [id]: checked });
    setMainCheckCount({
      ...mainCheckCount,
      [id]: checked ? permissions.length : 0,
    });
  };
  const handleSinglePermissionsChange = (mainId, value) => (e) => {
    const { id, checked } = e.target;
    setCheckbox({ ...checkbox, [id]: checked });
    getFormData((prev) => ({ ...prev, [value]: checked }));
    setMainCheckCount((prev) => {
      const newCount = (prev[mainId] || 0) + (checked ? 1 : -1);
      setMainChecked({
        ...mainChecked,
        [mainId]: newCount === rolesPermissions[mainId].length,
      });
      return { ...prev, [mainId]: newCount };
    });
  };
  const selectAllPermissions = (e) => {
    const checked = e.target.checked;
    const checkboxState = {};
    const selectedValues = {};
    const mainCheckCount = {};
    const mainChecked = {};
    Object.keys(rolesPermissions).forEach((perm) => {
      rolesPermissions[perm].forEach((item, i) => {
        checkboxState[`${perm}_${i}`] = checked;
        selectedValues[item.value] = checked;
      });
      mainCheckCount[perm] = checked ? rolesPermissions[perm].length : 0;
      mainChecked[perm] = checked;
    });
    setCheckbox(checkboxState);
    getFormData(selectedValues);
    setMainCheckCount(mainCheckCount);
    setMainChecked(mainChecked);
  };
  useEffect(() => {
    const mainChecked = {};
    const mainCheckCount = {};
    if(selectedPermissions){
    Object.keys(rolesPermissions).map((value) => {
      const arrray = [];
      rolesPermissions[value].map((item, i) => {      
        if (selectedPermissions?.includes(item?.value)) {
          setCheckbox((prev) => ({ ...prev, [`${value}_${i}`]: true }));
          getFormData((prev) => ({ ...prev, [item?.value]: true }));
          arrray.push(item?.value);
          mainChecked[value] = true;
        }
      });
      mainCheckCount[value] =  arrray.length || 0;
    });
    setMainCheckCount(mainCheckCount);
    setMainChecked(mainChecked);
  }
  }, [selectedPermissions]);
  return (
    <Wrapper className="bg-light-200 rounded-lg border border-gray-200">
     
      <Wrapper className="flex gap-2 items-center justify-between   p-3">
        <Checkbox
          id="allPermissions"
          value="all-permission"
          label="Select all permissions"
          onChange={selectAllPermissions}
          checked={
            mainChecked ? Object.values(mainChecked).every((v) => v) : false
          }
        />
        <span
          className="text-gray-600 text-sm cursor-pointer hover:text-gray-400 font-semibold"
          onClick={handleExpandAll}
        >               
          {Object.values(accordions).every((v) => v)
            ? "Hide all"
            : "Expand all"}
        </span>
      </Wrapper>
      {Object.keys(rolesPermissions).map((value) => (
        <Wrapper key={value} className="border-t border-gray-200">
          <div
            className="flex gap-2 items-center w-full justify-between p-3 cursor-pointer"
            id={`${value}Wrapper`}
            onClick={() => handleAccordion(`${value}Wrapper`)}
          >
            <Checkbox
              id={value}
              value={`all-${value}`  || ''}
              label={value.charAt(0).toUpperCase() + value.slice(1)}
              onChange={handlePermissionsChange(value, rolesPermissions[value])}
              checked={
                mainChecked[value] || selectedPermissions?.includes(value)
              }
            />

            <span className="text-[#C2C3CB] text-sm cursor-pointer flex items-center gap-1">
              <span>
                {mainCheckCount[value] || 0}/{rolesPermissions[value].length}
              </span>
              <span
                className={`arrow-down w-4 h-4 block ${
                  accordions[`${value}Wrapper`] ? "rotate-180" : "rotate-0"
                }`}
              >
                <svg
                  width="19"
                  height="18"
                  className="w-full h-auto block"
                  viewBox="0 0 19 18"
                  fill="none"
                >
                  <path
                    d="M3.33268 4.5863L2.0055 5.9138L9.50372 13.4138L17.002 5.9138L15.6748 4.5863L9.50372 10.7588L3.33268 4.5863Z"
                    fill="#C2C3CB"
                  />
                </svg>
              </span>
            </span>
          </div>          
          <Wrapper   
            className={`${
              accordions[`${value}Wrapper`] ? "block" : "hidden"
            } p-5 bg-white space-y-4 border-t border-gray-200`}
          >
            {rolesPermissions[value].map((item, i) => (          
                <Checkbox
                  key={i}
                  id={`${value}_${i}` || ''}
                  value={item.value}
                  label={item.item}
                  onChange={handleSinglePermissionsChange(value, item.value)}
                  checked={
                    checkbox[`${value}_${i}`] || false
                  }
                />        
            ))}
          </Wrapper>
        </Wrapper>
      ))}
    </Wrapper>
  );
};

export default Permissions;
