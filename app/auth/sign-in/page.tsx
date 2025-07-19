'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { Github } from 'lucide-react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
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
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    setIsLoading(provider);
    try {
      await signIn(provider, { redirectTo: '/' });
    } catch (error) {
      console.error(`${provider} sign-in failed:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-semibold text-2xl tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <LoadingButton
              className="w-full font-medium"
              isLoading={isLoading === 'github'}
              onClick={() => handleOAuthSignIn('github')}
            >
              <Github className="mr-2 size-4" />
              Continue with GitHub
            </LoadingButton>
            <LoadingButton
              className="w-full font-medium"
              isLoading={isLoading === 'google'}
              onClick={() => handleOAuthSignIn('google')}
            >
              <FcGoogle className="mr-2 size-4" />
              Continue with Google
            </LoadingButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
