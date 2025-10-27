import { Button } from "@/components/shadcnUI/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcnUI/form";
import { Input } from "@/components/shadcnUI/input";
import { cn } from "@/lib/utils";
import { Save, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ProfileFormValues } from "./types";

interface ProfileEditModeProps {
  form: UseFormReturn<ProfileFormValues>;
  dir: "rtl" | "ltr";
  safeDictionary: any;
  isLoading: boolean;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  onCancel: () => void;
}

export function ProfileEditMode({
  form,
  dir,
  safeDictionary,
  isLoading,
  onSubmit,
  onCancel
}: ProfileEditModeProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("")} dir={dir}>
                  {safeDictionary.account.profile.username}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={safeDictionary.account.profile.username}
                    className={cn("")}
                    {...field}
                    dir={dir}
                  />
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
                <FormLabel className={cn("")} dir={dir}>
                  {safeDictionary.account.profile.email}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={safeDictionary.account.profile.email}
                    className={cn("")}
                    {...field}
                    dir={dir}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("")} dir={dir}>
                  {safeDictionary.users.address}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={safeDictionary.users.address}
                    className={cn("")}
                    {...field}
                    dir={dir}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("")} dir={dir} >
                  {safeDictionary.users.phoneNumber}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={safeDictionary.users.phoneNumber}
                    className={cn("")}
                    {...field}
                    dir={dir}
                      />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className={cn("flex gap-3 pt-4")}>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className={cn("flex items-center gap-2")}>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{safeDictionary.general.saving}</span>
              </div>
            ) : (
              <div className={cn("flex items-center gap-2")}>
                <Save className="h-4 w-4" />
                <span>{safeDictionary.common.save}</span>
              </div>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            <div className={cn("flex items-center gap-2")}>
              <X className="h-4 w-4" />
              <span>{safeDictionary.common.cancel}</span>
            </div>
          </Button>
        </div>
      </form>
    </Form>
  );
}
