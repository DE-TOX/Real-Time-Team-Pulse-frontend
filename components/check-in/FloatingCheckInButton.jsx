'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import QuickCheckInForm from '../check-in/QuickCheckInForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { CheckCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function FloatingCheckInButton({ className, variant = "fab" }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleCheckInSubmit = async (checkInData) => {
    console.log('Submitting check-in:', checkInData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Here you would send the data to your backend
    setOpen(false);

    // Show success message (you could use a toast here)
    console.log('Check-in submitted successfully!');
  };

  const CheckInContent = () => (
    <div className="px-4">
      <QuickCheckInForm
        onSubmit={handleCheckInSubmit}
        onCancel={() => setOpen(false)}
      />
    </div>
  );

  if (variant === "fab") {
    return (
      <>
        {/* Floating Action Button */}
        <Button
          size="lg"
          className={cn(
            "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 md:hidden",
            "hover:scale-110 transition-transform",
            className
          )}
          onClick={() => setOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Mobile Drawer */}
        {!isDesktop && (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="max-h-[90vh]">
              <DrawerHeader className="text-center">
                <DrawerTitle className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  Quick Check-in
                </DrawerTitle>
                <DrawerDescription>
                  Share how you're feeling today
                </DrawerDescription>
              </DrawerHeader>
              <div className="overflow-y-auto px-4 pb-8">
                <CheckInContent />
              </div>
            </DrawerContent>
          </Drawer>
        )}

        {/* Desktop Dialog */}
        {isDesktop && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  Quick Check-in
                </DialogTitle>
                <DialogDescription className="text-center">
                  Share how you're feeling today
                </DialogDescription>
              </DialogHeader>
              <CheckInContent />
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  // Regular button variant
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={cn("gap-2", className)}
        size="lg"
      >
        <CheckCircle className="h-5 w-5" />
        Quick Check-in
      </Button>

      {/* Mobile Drawer */}
      {!isDesktop && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="text-center">
              <DrawerTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                Quick Check-in
              </DrawerTitle>
              <DrawerDescription>
                Share how you're feeling today
              </DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-8">
              <CheckInContent />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Desktop Dialog */}
      {isDesktop && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                Quick Check-in
              </DialogTitle>
              <DialogDescription className="text-center">
                Share how you're feeling today
              </DialogDescription>
            </DialogHeader>
            <CheckInContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}