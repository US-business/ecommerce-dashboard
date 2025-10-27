'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/shadcnUI/card';
import { Button } from '@/components/shadcnUI/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const lang = (params?.lang as string) || 'ar';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center" dir={dir}>
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {dir === 'rtl' ? 'حدث خطأ ما!' : 'Something went wrong!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {dir === 'rtl'
                ? 'واجهنا خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى.'
                : 'We encountered an error while loading the products. Please try again.'}
            </p>
            <Button onClick={reset} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              {dir === 'rtl' ? 'حاول مرة أخرى' : 'Try again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}