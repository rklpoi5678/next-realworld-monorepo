import Link from "next/link";

import { Card } from "@/components/ui/card";
import { paths } from "#/config/paths";

export function CardList({ items }) {
  return (
    <div className="grid grid-cols-4 gap-4 cursor-pointer">
      {items.map((item) => (
        <Link
          key={item.id}
          href={paths.app.itemDetail.getHref(item.id)}
        >
          <Card
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