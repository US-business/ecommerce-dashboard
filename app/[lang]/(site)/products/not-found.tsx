import { Card, CardContent } from '@/components/shadcnUI/card';
import { Button } from '@/components/shadcnUI/button';
import { Search, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
         <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto text-center">
               <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                     Products Not Found
                  </h2>
                  <p className="text-gray-600 mb-6">
                     The products page you're looking for doesn't exist or has been moved.
                  </p>
                  <div className="space-y-3">
                     <Button asChild className="w-full">
                        <Link href="/products" className="flex items-center gap-2">
                           <Search className="w-4 h-4" />
                           Browse All Products
                        </Link>
                     </Button>
                     <Button variant="outline" asChild className="w-full">
                        <Link href="/" className="flex items-center gap-2">
                           <Home className="w-4 h-4" />
                           Go Home
                        </Link>
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}