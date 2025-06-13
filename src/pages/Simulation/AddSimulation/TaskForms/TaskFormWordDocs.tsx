import { TextField } from "../TextField";
import { RichTextEditorField } from "../RichTextEditor";
import { Save } from "lucide-react";

export function TaskFormWordDocs({
  values,
  onChange,
  onSubmit,
  taskNumber,
}: any) {
  const { description, taskLocation, hint, skillName, skillScore } = values;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <TextField
        label="Task Description"
        required
        value={description}
        onChange={e => onChange("description", e.target.value)}
        placeholder="Enter task description"
      />
      <TextField
        label="Task Location"
        required
        value={taskLocation}
        onChange={e => onChange("taskLocation", e.target.value)}
        placeholder="Enter task location"
      />
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
       <button
        className="bg-[#06B2E1] text-white flex rounded-full px-6 py-3 mt-6 self-start items-center gap-2"
        type="submit"
      >
        <Save size={16} />
        Save Task
      </button>
    </form>
  );
}
