import PageHeader from "~/features/page/components/page-header";
import PendingReviewAlert from "~/features/reviews/components/pending-review-alert";
import UserReviews from "~/features/reviews/components/user-reviews";

const MyReviews = () => {
  return (
    <div>
      <PageHeader
        title="My Reviews"
        description="Track and manage all your reviews here."
      />
      <PendingReviewAlert />
      <UserReviews />
    </div>
  );
};

export default MyReviews;
