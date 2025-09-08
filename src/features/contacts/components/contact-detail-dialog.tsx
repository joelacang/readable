import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useContactDetailDialog } from "../hooks/use-contact-detail-dialog";
import {
  BriefcaseIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const ContactDetailDialog = () => {
  const { open, onClose, contact } = useContactDetailDialog();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        {contact && (
          <div className="space-y-4">
            <DialogHeader>
              <div className="flex flex-row items-center gap-4">
                <div className="from-almond-300 to-almond-700 rounded-full bg-gradient-to-b p-2.5">
                  <UserIcon className="text-white" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-left">
                    {contact.name}
                  </DialogTitle>
                  <DialogDescription className="text-left">
                    {contact.description}
                  </DialogDescription>
                </div>
              </div>

              <Separator />
            </DialogHeader>

            {/* Content */}
            <div className="max-h-[60vh] space-y-6 overflow-auto p-6">
              {/* Position & Role */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <BriefcaseIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.position}
                  </p>
                  <p className="text-sm text-gray-500">Role: {contact.role}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <PhoneIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm text-blue-600 transition-colors hover:text-blue-800"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <MailIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-blue-600 transition-colors hover:text-blue-800"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <MapPinIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  {contact.address ? (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{contact.address.line1}</p>
                      {contact.address.line2 && <p>{contact.address.line2}</p>}
                      <p>
                        {contact.address.city}, {contact.address.state}{" "}
                        {contact.address.postalCode}
                      </p>
                      <p>{contact.address.country}</p>
                    </div>
                  ) : (
                    <div>
                      <p>Not Indicated</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="pt-4">
              <Button>Edit Contact</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailDialog;
