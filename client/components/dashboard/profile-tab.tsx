"use client";

import { Card } from "@/components/ui/card";
import { User, Mail, Shield, Calendar } from "lucide-react";

interface ProfileTabProps {
  user: any;
}

export function ProfileTab({ user }: ProfileTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Welcome Card */}
      <Card className="p-6 md:col-span-2 lg:col-span-3">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Welcome back, {user.name}!
            </h2>
            <p className="text-muted-foreground">
              Manage your account and view your activity
            </p>
          </div>
        </div>
      </Card>

      {/* User Info Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Account Info</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                user.role === "admin"
                  ? "bg-primary/10 text-primary"
                  : user.role === "employee"
                  ? "bg-accent/10 text-accent-foreground"
                  : "bg-secondary/10 text-secondary-foreground"
              }`}
            >
              {user.role}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email Verified</p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user.emailVerified
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {user.emailVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
      </Card>

      {/* Account Status Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Account Status</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user.banned
                  ? "bg-destructive/10 text-destructive"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              }`}
            >
              {user.banned ? "Inactive" : "Active"}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-mono text-xs text-foreground break-all">
              {user.id}
            </p>
          </div>
        </div>
      </Card>

      {/* Account Timeline Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Timeline</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-sm text-foreground">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-sm text-foreground">
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Authentication Method Info */}
      <Card className="p-6 md:col-span-2 lg:col-span-3">
        <h3 className="font-semibold text-foreground mb-4">
          Authentication Method
        </h3>
        <div className="flex items-center gap-3">
          {user.image ? (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm text-foreground">
                Signed in with Google
              </span>
            </>
          ) : (
            <>
              <Mail className="h-5 w-5" />
              <span className="text-sm text-foreground">
                Signed in with Email & Password
              </span>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
