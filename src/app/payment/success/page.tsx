// app/payment/success/page.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PaymentSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-center p-4">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold font-poppins mb-2">Payment Successful!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Thank you for your payment. Your records will be updated shortly.
      </p>
      <Button asChild>
        <Link href="/medical-records">Return to Medical Records</Link>
      </Button>
    </div>
  );
};

export default PaymentSuccessPage;