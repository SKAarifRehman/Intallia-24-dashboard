// import { useState } from "react";
// import { TextField } from "../TextField";
// import { SelectField } from "../SelectField";
// import { RichTextEditorField } from "../RichTextEditor";
// import { Save } from "lucide-react";

// export function TaskFormExcelSheets({
//   values,
//   onChange,
//   onSubmit,
//   taskNumber,
// }: any) {
//   const {
//     description,
//     sheetName,
//     selectType,
//     cellLocation,
//     fromRange,
//     toRange,
//     hint,
//     skillName,
//     skillScore,
//   } = values;

//   return (
//     <form
//       className="flex flex-col gap-4"
//       onSubmit={e => {
//         e.preventDefault();
//         onSubmit();
//       }}
//     >
//       <TextField
//         label="Task Description"
//         required
//         value={description}
//         onChange={e => onChange("description", e.target.value)}
//         placeholder="Enter task description"
//       />
//       <TextField
//         label="Sheet Name"
//         required
//         value={sheetName}
//         onChange={e => onChange("sheetName", e.target.value)}
//         placeholder="Enter sheet name"
//       />
//       <div className="flex gap-4 items-end">
//         <div className="flex-1">
//           <label className="block mb-1 font-medium">
//             Select <span className="text-[#FF3A3A]">*</span>
//           </label>
//           <SelectField
//             value={selectType}
//             onChange={e => onChange("selectType", e.target.value)}
//             className="w-full"
//           >
//             <option value="Cell">Cell</option>
//             <option value="Range">Range</option>
//           </SelectField>
//         </div>
//         <div className="flex items-center gap-4">
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               checked={selectType === "Cell"}
//               onChange={() => onChange("selectType", "Cell")}
//               className="accent-[#06B2E1]"
//             />
//             <span>Cell</span>
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               checked={selectType === "Range"}
//               onChange={() => onChange("selectType", "Range")}
//               className="accent-[#06B2E1]"
//             />
//             <span>Range</span>
//           </label>
//         </div>
//         {selectType === "Cell" && (
//           <div className="flex-1">
//             <TextField
//               label="Result Cell Location"
//               required
//               value={cellLocation}
//               onChange={e => onChange("cellLocation", e.target.value)}
//               placeholder="Cell ID"
//               className="w-full"
//             />
//           </div>
//         )}
//         {selectType === "Range" && (
//           <>
//             <div className="flex-1">
//               <TextField
//                 label="From"
//                 required
//                 value={fromRange}
//                 onChange={e => onChange("fromRange", e.target.value)}
//                 placeholder="From"
//                 className="w-full"
//               />
//             </div>
//             <div className="flex-1">
//               <TextField
//                 label="To"
//                 required
//                 value={toRange}
//                 onChange={e => onChange("toRange", e.target.value)}
//                 placeholder="To"
//                 className="w-full"
//               />
//             </div>
//           </>
//         )}
//       </div>
//       <RichTextEditorField
//         label="Hint"
//         onChange={val => onChange("hint", val)}
//         defaultValue={hint}
//       />
//       <div className="flex gap-4">
//         <TextField
//           label="Skill Name"
//           required
//           value={skillName}
//           onChange={e => onChange("skillName", e.target.value)}
//           placeholder="SK1, SK2"
//           className="flex-1"
//         />
//         <TextField
//           label="Skill Score"
//           required
//           value={skillScore}
//           onChange={e => onChange("skillScore", e.target.value)}
//           placeholder="45, 15"
//           className="flex-1"
//         />
//       </div>
//       <button
//         className="bg-[#06B2E1] text-white flex rounded-full px-6 py-3 mt-6 self-start items-center gap-2"
//         type="submit"
//       >
//         <Save size={16} />
//         Save Task
//       </button>
//     </form>
//   );
// }




import { TextField } from "../TextField";
import { SelectField } from "../SelectField";
import { RichTextEditorField } from "../RichTextEditor";

export function TaskFormExcelSheets({
  values,
  onChange,
  taskNumber,
}: any) {
  const {
    description,
    sheetName,
    selectType,
    cellLocation,
    fromRange,
    toRange,
    hint,
    skillName,
    skillScore,
  } = values;

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Task Description"
        required
        value={description}
        onChange={e => onChange("description", e.target.value)}
        placeholder="Enter task description"
      />
      <TextField
        label="Sheet Name"
        required
        value={sheetName}
        onChange={e => onChange("sheetName", e.target.value)}
        placeholder="Enter sheet name"
      />
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block mb-1 font-medium">
            Select <span className="text-[#FF3A3A]">*</span>
          </label>
          <SelectField
            value={selectType}
            onChange={e => onChange("selectType", e.target.value)}
            className="w-full"
          >
            <option value="Cell">Cell</option>
            <option value="Range">Range</option>
          </SelectField>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={selectType === "Cell"}
              onChange={() => onChange("selectType", "Cell")}
              className="accent-[#06B2E1]"
            />
            <span>Cell</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={selectType === "Range"}
              onChange={() => onChange("selectType", "Range")}
              className="accent-[#06B2E1]"
            />
            <span>Range</span>
          </label>
        </div>
        {selectType === "Cell" && (
          <div className="flex-1">
            <TextField
              label="Result Cell Location"
              required
              value={cellLocation}
              onChange={e => onChange("cellLocation", e.target.value)}
              placeholder="Cell ID"
              className="w-full"
            />
          </div>
        )}
        {selectType === "Range" && (
          <>
            <div className="flex-1">
              <TextField
                label="From"
                required
                value={fromRange}
                onChange={e => onChange("fromRange", e.target.value)}
                placeholder="From"
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <TextField
                label="To"
                required
                value={toRange}
                onChange={e => onChange("toRange", e.target.value)}
                placeholder="To"
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
      <RichTextEditorField
        label="Hint"
        onChange={val => onChange("hint", val)}
        defaultValue={hint}
      />
      <div className="flex gap-4">
        <TextField
          label="Skill Name"
          required
          value={skillName}
          onChange={e => onChange("skillName", e.target.value)}
          placeholder="SK1, SK2"
          className="flex-1"
        />
        <TextField
          label="Skill Score"
          required
          value={skillScore}
          onChange={e => onChange("skillScore", e.target.value)}
          placeholder="45, 15"
          className="flex-1"
        />
      </div>
    </div>
  );
}
