// app/payment/cancel/page.tsx
import React from 'react';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PaymentCancelPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-center p-4">
      <XCircle className="w-24 h-24 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold font-poppins mb-2">Payment Canceled</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your payment was not processed. You can try again from your dashboard.
      </p>
      <Button asChild>
        <Link href="/medical-records">Return to Medical Records</Link>
      </Button>
    </div>
  );
};

export default PaymentCancelPage;