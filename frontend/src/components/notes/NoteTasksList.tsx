import type { Task } from '../../types/task'

interface Props {
  tasks: Task[]
}

export function NoteTasksList({ tasks }: Props) {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks for this note</p>
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="border rounded p-3 bg-white shadow-sm"
        >
          <p className="font-medium">{task.title}</p>
          {task.description && (
            <p className="text-sm text-gray-600">{task.description}</p>
          )}
        </li>
      ))}
    </ul>
  )
}
