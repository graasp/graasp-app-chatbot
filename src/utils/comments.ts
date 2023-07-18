import { UUID } from '@graasp/sdk';

import { CommentAppData } from '@/config/appData';

const findCommentWithId = (
  comments: CommentAppData[],
  commentId: UUID,
): CommentAppData | undefined => comments.find((c) => c.id === commentId);

const findCommentWithParentId = (
  comments: CommentAppData[],
  commentId: UUID,
): CommentAppData | undefined =>
  comments.find((c) => c.data?.parent === commentId);

const findChild = (
  comments: CommentAppData[],
  parentId: UUID,
): CommentAppData | undefined =>
  comments.find((c) => c.data.parent === parentId);

const getThreadIdsFromLastCommentId = (
  allComments: CommentAppData[],
  lastCommentId: UUID,
): UUID[] => {
  // this method goes bottom up to find comment ids in the thread
  const thread = [];
  let parentId = lastCommentId;
  let parent = null;
  do {
    parent = findCommentWithId(allComments, parentId);
    if (parent) {
      thread.push(parentId);
      parentId = parent.data?.parent as UUID;
    }
  } while (parent);
  return thread;
};

const getThreadIdsFromFirstCommentId = (
  allComments: CommentAppData[],
  firstId: UUID,
): UUID[] => {
  // this method goes from top to bottom
  let parentId = firstId;
  const thread = [firstId];
  let children = null;
  // find children to the comment
  do {
    children = findCommentWithParentId(allComments, parentId);
    if (children) {
      thread.push(children.id);
      parentId = children.id;
    }
  } while (children);
  return thread;
};

const getOrphans = (allComments: CommentAppData[]): CommentAppData[] => {
  // orphans are comments which parent does not exist
  const orphans: CommentAppData[] = [];
  allComments.forEach((c) => {
    const parentId = c.data?.parent as UUID;
    const parent = findCommentWithId(allComments, parentId);
    // comment is not on thread start but his parent is not found
    if (parentId && !parent) {
      orphans.push(c);
    }
  });
  return orphans;
};

const buildThread = (
  parentComment: CommentAppData,
  comments: CommentAppData[],
): CommentAppData[] => {
  // build thread list
  const thread = [parentComment];
  let parentId = parentComment.id;
  let nextChild = null;
  do {
    nextChild = findChild(comments, parentId);
    if (nextChild) {
      thread.push(nextChild);
      parentId = nextChild.id;
    }
  } while (nextChild);

  return thread;
};

export {
  buildThread,
  findChild,
  findCommentWithId,
  findCommentWithParentId,
  getThreadIdsFromLastCommentId,
  getThreadIdsFromFirstCommentId,
  getOrphans,
};
