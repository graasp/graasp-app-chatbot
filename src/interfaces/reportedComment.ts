import { AppData } from '@graasp/sdk';

interface ReportedCommentAppData {
  data: {
    reason: string;
    commentId: string;
  };
}
export type ReportedCommentType = AppData & ReportedCommentAppData;
