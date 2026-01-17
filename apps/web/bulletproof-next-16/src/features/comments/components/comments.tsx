import { usePathname } from 'next/navigation';

import { CommentsList } from './comments-list';
import { CreateComment } from './create-comment';

export const Comments = ({ discussionId }: { discussionId: string }) => {
  const pathname = usePathname();
  const isPublicView = pathname?.startsWith?.('/public/');

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Comments:</h3>
        {!isPublicView && <CreateComment discussionId={discussionId} />}
      </div>
      <CommentsList discussionId={discussionId} />
    </div>
  );
};
