'use client'

import { Drawer } from 'vaul'
import { ExternalLink } from 'lucide-react'

type ProjectItem = {
  uid: string
  title: string
  shortDescription: string
  longDescription: string
  link?: string
  categories: string[]
  priority: number
  updateNotes: { text: string; date: string; log?: string }[]
}

type DrawerProps = {
  project: ProjectItem
  categories: Record<string, string>
}

export default function ProjectDrawer({
  project,
  categories,
}: DrawerProps) {
  return (
    <Drawer.Root>
      <Drawer.Trigger className="border border-[#e1e4e8] rounded-md p-2 bg-white hover:bg-[#f6f8fa] transition-colors duration-200 relative cursor-pointer w-full text-left">
        <div className="flex absolute top-0 left-0 right-0 h-0.5">
          {project.categories.map((cat) => (
            <div
              key={cat}
              className="flex-grow"
              style={{
                backgroundColor:
                  cat === 'live'
                    ? '#ff0000'
                    : cat === 'experiments'
                    ? '#90EE90'
                    : cat === 'toy'
                    ? '#008000'
                    : cat === 'learning'
                    ? '#FFFF00'
                    : cat === 'old'
                    ? '#696969'
                    : 'transparent',
              }}
            />
          ))}
        </div>
        <div
          className={`text-sm transition-colors duration-300 focus-visible:outline-none ${
            project.categories.includes('old')
              ? 'text-gray-500 hover:text-gray-700'
              : 'hover:text-[#050005]'
          }`}
        >
          <h3 className="text-sm font-medium mb-1">{project.title}</h3>
          <p className="text-xs line-clamp-2">{project.shortDescription}</p>
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[40vh] mt-[60vh] fixed bottom-0 left-0 right-0 overflow-hidden">
          <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            <div className="max-w-md mx-auto pb-6">
              <div className="flex justify-between items-start mb-2">
                <Drawer.Title className="font-medium text-[15px] flex items-center">
                  <strong>{project.title}</strong>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 ml-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </Drawer.Title>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.categories.map((category) => (
                  <span
                    key={category}
                    className="text-xs bg-gray-100 text-gray-800 rounded-md px-2 py-1"
                  >
                    {categories[category]}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                {project.longDescription}
              </p>
              <div className="mt-4 text-sm">
                <h4 className="font-medium mb-2">Voyage Log</h4>
                <div className="bg-gray-100 p-3 rounded-md max-h-48 overflow-y-auto mb-6">
                  <ul className="list-none text-gray-600 space-y-2 divide-y divide-gray-200 divide-opacity-50">
                    {project.updateNotes.map((note, index) => (
                      <li key={index} className="flex flex-col pt-2 first:pt-0">
                        <div className="flex justify-between">
                          <span>{note.text}</span>
                          <span className="text-gray-400">{note.date}</span>
                        </div>
                        {note.log && (
                          <span className="text-xs text-gray-500 mt-1">
                            {note.log}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}