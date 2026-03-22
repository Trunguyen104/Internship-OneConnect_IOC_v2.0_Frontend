export default function SkillTag({ skill, editMode, onEdit }) {
  return (
    <div
      onClick={() => editMode && onEdit(skill)}
      className={`group border-border flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${editMode ? 'hover:bg-danger-surface hover:text-danger hover:border-danger' : ''} `}
    >
      <span>{skill.name}</span>

      {skill.level && (
        <span className="bg-muted/10 text-muted rounded-full px-2 py-0.5 text-xs">
          {skill.level}
        </span>
      )}
    </div>
  );
}
