'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { Github } from 'lucide-react';
import { useState } from 'react';
import LoadingButton from '@/components/loading-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex h-screen grow flex-col items-center justify-center gap-4 p-8 text-center">
      <Card className="w-full max-w-xs shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with you Github account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <LoadingButton
                className="w-full font-semibold"
                isLoading={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  // yes, I know this returns a Promise, and I intentionally don't want to handle it
                  signIn('github', {
                    redirectTo: '/',
                  });
                }}
              >
                <Github className="mr-2" />
                Login with Github
              </LoadingButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
