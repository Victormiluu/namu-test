import type { Content, Category } from "../services/api";
import ContentCard from "./Card";

interface ContentGridProps {
  contents: Content[];
  categories: Category[];
}

export default function ContentGrid({
  contents,
  categories,
}: ContentGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {contents.map((content) => {
        const category = categories.find(
          (item) => item.slug === content.category,
        );

        return (
          <ContentCard
            key={content.id}
            content={content}
            categoryName={category?.name ?? "Bem-estar"}
          />
        );
      })}
    </div>
  );
}