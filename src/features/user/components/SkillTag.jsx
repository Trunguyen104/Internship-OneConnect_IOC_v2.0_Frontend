export default function SkillTag({ skill, editMode, onEdit }) {
  return (
    <div
      onClick={() => editMode && onEdit(skill)}
      className={`group flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium transition ${editMode ? 'hover:border-red-500 hover:bg-red-50' : ''} `}
    >
      <span>{skill.name}</span>

      {skill.level && (
        <span className='rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500'>
          {skill.level}
        </span>
      )}
    </div>
  );
}
