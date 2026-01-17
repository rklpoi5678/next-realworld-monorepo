import Link from "next/link";

import { BestCard } from "@/components/ui/card/best-card";
import { paths } from "#/config/paths";

export function BestCardList({ items }) {
  return (
    <div className="grid grid-cols-4 gap-4 cursor-pointer">
      {items.map((item) => (
        <Link
          key={item.id}
          href={paths.app.itemDetail.getHref(item.id)}
        >
          <BestCard
            name={item.name}
            price={item.price}
            images={item.images}
            likes={item._count.itemLikes}
          />
        </Link>
      ))}
    </div>
  );
}