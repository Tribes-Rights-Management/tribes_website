import { ReactNode, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Global Admin Banner
export function AdminBanner() {
  return (
    <div className="h-8 flex items-center px-8 border-b border-border/20 bg-background">
      <p className="text-[11px] text-muted-foreground/70">
        Administrative actions affect legally binding records. Review carefully before proceeding.
      </p>
    </div>
  );
}

// Status Change Inline Note
export function StatusChangeNote() {
  return (
    <p className="text-[11px] text-muted-foreground mt-2">
      Status changes are recorded in the license audit history.
    </p>
  );
}

// Admin Footer Note
export function AdminFooterNote() {
  return (
    <p className="text-[10px] text-muted-foreground/50 mt-4">
      Administrative actions are logged and retained as part of the permanent record.
    </p>
  );
}

// View-Only Admin Message
export function ViewOnlyMessage() {
  return (
    <div className="py-3 px-4 bg-muted/20 rounded text-[12px] text-muted-foreground">
      You have view-only access. Contact a Super Admin to make changes.
    </div>
  );
}

// Audit Log Header
export function AuditLogHeader() {
  return (
    <div className="mb-4">
      <p className="text-[12px] text-muted-foreground">
        This log reflects a permanent record of administrative actions.
      </p>
      <p className="text-[11px] text-muted-foreground/60 mt-1">
        Entries cannot be edited or removed.
      </p>
    </div>
  );
}

// Delete/Remove Blocking Modal
interface DeleteBlockModalProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteBlockModal({ open, onClose }: DeleteBlockModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Records cannot be deleted</AlertDialogTitle>
          <AlertDialogDescription>
            Licenses and audit history are permanently retained for legal integrity.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Post-Approval Edit Blocking Modal
interface EditBlockModalProps {
  open: boolean;
  onClose: () => void;
  licenseId?: string;
}

export function EditBlockModal({ open, onClose, licenseId }: EditBlockModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>This license has been approved</AlertDialogTitle>
          <AlertDialogDescription>
            Approved licenses cannot be edited. To make changes, issue a superseding license.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Approval Confirmation Modal
interface ApprovalConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
  licenseId?: string;
}

export function ApprovalConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  isProcessing = false,
  licenseId 
}: ApprovalConfirmModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    setConfirmed(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve license for execution</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Approving this license confirms that the requested use, scope, term, 
              and territory have been reviewed.
            </p>
            <p>
              Once approved, license terms cannot be edited.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex items-start gap-3 py-4">
          <Checkbox 
            id="confirm-approval" 
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked === true)}
          />
          <label 
            htmlFor="confirm-approval" 
            className="text-[13px] text-foreground leading-relaxed cursor-pointer"
          >
            I have reviewed the license details and confirm they are correct.
          </label>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={!confirmed || isProcessing}
          >
            {isProcessing ? "Processing…" : "Approve and proceed"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Superseding License Confirmation Modal
interface SupersedeConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isProcessing?: boolean;
  licenseId?: string;
}

export function SupersedeConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  isProcessing = false,
  licenseId 
}: SupersedeConfirmModalProps) {
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Issue superseding license</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Superseding a license creates a new, independent license with a new License ID.
            </p>
            <p>
              The original license will remain on record and marked as superseded.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-2">
          <label className="text-[12px] text-muted-foreground mb-2 block">
            Reason for superseding (required)
          </label>
          <Textarea 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason…"
            rows={3}
            className="text-[13px]"
          />
          <p className="text-[11px] text-muted-foreground mt-2">
            This explanation becomes part of the permanent audit record.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={!reason.trim() || isProcessing}
          >
            {isProcessing ? "Processing…" : "Create superseding license"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Export Finality Warning
interface ExportWarningProps {
  canExport: boolean;
}

export function ExportWarning({ canExport }: ExportWarningProps) {
  if (canExport) {
    return (
      <p className="text-[11px] text-muted-foreground">
        Only fully executed licenses may be exported. Exported documents reflect final, binding terms.
      </p>
    );
  }
  
  return (
    <p className="text-[11px] text-muted-foreground">
      All licenses in this package must be executed before export.
    </p>
  );
}

// Access Request Approve Modal (Enhanced)
interface AccessApproveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
  userName?: string;
}

export function AccessApproveModal({ 
  open, 
  onClose, 
  onConfirm, 
  isProcessing = false,
  userName 
}: AccessApproveModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve access</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This will grant {userName || "this user"} access to Tribes Rights Licensing.
            </p>
            <p>
              A login email will be sent and the user will be able to submit license requests.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? "Processing…" : "Approve access"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Access Request Reject Modal (Enhanced)
interface AccessRejectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
}

export function AccessRejectModal({ 
  open, 
  onClose, 
  onConfirm, 
  isProcessing = false 
}: AccessRejectModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject access request</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This request will be closed.
            </p>
            <p>
              No account will be created and no notification will be sent.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? "Processing…" : "Reject request"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
