import { TagList } from "./tag-list";

interface SelectTagProps {
  tags: string[];
  selectedTag?: string;
}

export const SelectTag = ({ tags, selectedTag }: SelectTagProps) => {
  if (tags.length === 0) return null;
  return (
    <>
      {/** mobile */}
      <nav className="lg:hidden">
        <TagList
          mode="filter"
          tags={tags}
          selectedTag={selectedTag}
          className="overflow-x-auto no-scrollbar touch-scroll pb-2"
        />
      </nav>

      {/** desktop */}
      <aside className="hidden lg:block  bg-gray-100 dark:bg-gray-800 p-4 rounded-lg lg:w-[180px]">
        <section>
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Popular Tags
          </h2>
          <nav>
            <TagList mode="filter" tags={tags} selectedTag={selectedTag} />
          </nav>
        </section>
      </aside>
    </>
  )
}