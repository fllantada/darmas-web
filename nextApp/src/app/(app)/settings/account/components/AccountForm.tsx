"use client";

import { useState } from "react";
import type { UserType } from "@/generated/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TimezoneSelector, { timezones } from "@/components/TimezoneSelector";

import { updateUserDetails, updateUserSettings } from "../actions";
import { accountStrings } from "../strings";
import NotificationSelector, { NotificationType } from "./NotificationSelector";

const formSchema = z.object({
  firstName: z.string().max(30).min(1, "First name is required."),
  lastName: z.string().max(30).min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .optional(),
  timezone: z.enum(timezones.map(({ name }) => name) as [string, ...string[]]),
  notifications: z
    .set(z.nativeEnum(NotificationType))
    .nonempty("Please select at least one notification type."),
});

type FormValues = z.infer<typeof formSchema>;

interface IProps {
  user: UserType;
}

export default function AccountForm({ user }: IProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.details.firstName || "",
      lastName: user.details.lastName || "",
      email: user.details.email || "",
      timezone:
        user.settings?.preferredTimezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: new Set(
        user.settings?.notificationPreferences?.split(",") || [
          NotificationType.App,
        ],
      ),
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    await Promise.all([
      updateUserDetails(
        user.id,
        values.firstName,
        values.lastName,
        values.email,
        values.password || undefined,
      ),
      updateUserSettings(
        user.id,
        values.timezone,
        Array.from(values.notifications).join(","),
      ),
    ]);
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Role</FormLabel>
          <div className="mt-2">
            {
              accountStrings.ROLES[
                (user.details.role as keyof typeof accountStrings.ROLES) ||
                  "user"
              ]
            }
          </div>
        </FormItem>

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Local Time Zone</FormLabel>
              <FormControl>
                <TimezoneSelector
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notification Preferences</FormLabel>
              <FormControl>
                <NotificationSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}
