import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useOrgDetailDialog } from "../hooks/use-org-detail-dialog";
import type { AddressType } from "~/types/order";
import { ContactRole, type OrganizationType } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  BriefcaseIcon,
  Building2Icon,
  Contact,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAddress = (address: AddressType) => {
  if (!address) return "No address provided";

  const parts = [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
};

const getTypeColor = (type: OrganizationType) => {
  const colors = {
    DISTRIBUTOR: "bg-blue-100 text-blue-800 border-blue-200",
    SUPPLIER: "bg-green-100 text-green-800 border-green-200",
    RETAILER: "bg-purple-100 text-purple-800 border-purple-200",
    MANUFACTURER: "bg-orange-100 text-orange-800 border-orange-200",
    WHOLESALER: "bg-cyan-100 text-cyan-800 border-cyan-200",
    VENDOR: "bg-yellow-100 text-yellow-800 border-yellow-200",
    OTHER: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colors[type] || colors.OTHER;
};

const getRoleColor = (role: ContactRole) => {
  const colors = {
    SALES: "bg-emerald-100 text-emerald-800",
    MANAGER: "bg-indigo-100 text-indigo-800",
    SUPPORT: "bg-teal-100 text-teal-800",
    BILLING: "bg-amber-100 text-amber-800",
    TECHNICAL: "bg-violet-100 text-violet-800",
    PROCUREMENT: "bg-rose-100 text-rose-800",
    LEGAL: "bg-slate-100 text-slate-800",
    OTHER: "bg-gray-100 text-gray-800",
  };
  return colors[role] || colors[ContactRole.OTHER];
};

const OrganizationDetailDialog = () => {
  const { open, onClose, organization } = useOrgDetailDialog();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Organization Detail</DialogTitle>
        </DialogHeader>
        {organization && (
          <div className="h-[calc(100vh-20rem)] overflow-auto">
            <div className="mx-auto max-w-4xl space-y-6 px-4">
              {/* Header Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Building2Icon className="text-primary h-8 w-8" />
                        <CardTitle className="text-xl font-bold text-balance">
                          {organization.name}
                        </CardTitle>
                      </div>
                      <Badge className={getTypeColor(organization.type)}>
                        {organization.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    {organization.description}
                  </p>
                </CardHeader>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneIcon className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <MailIcon className="text-muted-foreground h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a
                          href={`mailto:${organization.email}`}
                          className="text-primary text-sm hover:underline"
                        >
                          {organization.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <PhoneIcon className="text-muted-foreground h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Primary Phone</p>
                        <a
                          href={`tel:${organization.phone}`}
                          className="text-primary text-sm hover:underline"
                        >
                          {organization.phone}
                        </a>
                      </div>
                    </div>

                    {organization.phoneAlt && (
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="text-muted-foreground h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">
                            Alternative Phone
                          </p>
                          <a
                            href={`tel:${organization.phoneAlt}`}
                            className="text-primary text-sm hover:underline"
                          >
                            {organization.phoneAlt}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <GlobeIcon className="text-muted-foreground h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        {organization.website ? (
                          <a
                            href={organization.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-sm hover:underline"
                          >
                            {organization.website}
                          </a>
                        ) : (
                          <p>Not Indicated</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">{organization.address?.line1}</p>
                    {organization.address?.line2 && (
                      <p>{organization.address.line2}</p>
                    )}
                    <p>
                      {organization.address?.city},{" "}
                      {organization.address?.state}{" "}
                      {organization.address?.postalCode}
                    </p>
                    <p className="text-muted-foreground">
                      {organization.address?.country}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Persons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Contact Persons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {organization.contactPersons.map((contact, index) => (
                      <div key={contact.id}>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {contact.name}
                              </h3>
                              <div className="mt-1 flex items-center gap-2">
                                <BriefcaseIcon className="text-muted-foreground h-4 w-4" />
                                <span className="text-muted-foreground text-sm">
                                  {contact.position}
                                </span>
                              </div>
                            </div>
                            <Badge
                              className={getRoleColor(
                                contact.role ?? ContactRole.OTHER,
                              )}
                            >
                              {contact.role}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground text-sm text-pretty">
                            {contact.description}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-primary flex items-center gap-2 hover:underline"
                            >
                              <MailIcon className="h-3 w-3" />
                              {contact.email}
                            </a>
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-primary flex items-center gap-2 hover:underline"
                            >
                              <PhoneIcon className="h-3 w-3" />
                              {contact.phone}
                            </a>
                          </div>
                        </div>

                        {index < organization.contactPersons.length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationDetailDialog;
