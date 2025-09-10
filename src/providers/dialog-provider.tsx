"use client";

import { useEffect, useState } from "react";
import AuthorDetailDialog from "~/features/authors/components/author-detail-dialog";
import AuthorFormDialog from "~/features/authors/components/author-form-dialog";
import AddToCardDialog from "~/features/cart/components/add-to-cart-dialog";
import CategoryDialog from "~/features/categories/components/category-dialog";
import ContactDetailDialog from "~/features/contacts/components/contact-detail-dialog";
import ContactFormDialog from "~/features/contacts/components/contact-form-dialog";
import ConfirmAlert from "~/features/dialogs/components/confirm-dialog";
import OrganizationDetailDialog from "~/features/organization/components/organization-detail-dialog";
import OrganizationFormDialog from "~/features/organization/components/organization-form-dialog";
import ReviewDialog from "~/features/reviews/components/review-dialog";
import SeriesDialog from "~/features/series/components/series-dialog";

const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CategoryDialog />
      <AuthorFormDialog />
      <ConfirmAlert />
      <SeriesDialog />
      <AddToCardDialog />
      <AuthorDetailDialog />
      <ReviewDialog />
      <ContactFormDialog />
      <ContactDetailDialog />
      <OrganizationFormDialog />
      <OrganizationDetailDialog />
    </>
  );
};

export default DialogProvider;
