import ChangePasswordForm from "@/components/change-password-form";
import EditProfileForm from "@/components/edit-profile-form";
import SystemSettingsForm from "@/components/system-settings-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGlobalValue } from "@/lib/global-values";

export default async function Page() {
  const monthlyFee = await getGlobalValue("monthlyFee");
  return (
    <div className="flex h-full w-full flex-col gap-8 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">الإعدادات</h2>
        <p className="text-muted-foreground">
          يمكنك تغيير اعدادات النظام والتعديل على ملفك الشخصي من هنا
        </p>
      </div>
      <Tabs defaultValue="personal-info">
        <TabsList>
          <TabsTrigger value="personal-info">البيانات الشخصية</TabsTrigger>
          <TabsTrigger value="change-passsword">تغيير كلمة المرور</TabsTrigger>
          <TabsTrigger value="system-settings">إعدادات النظام</TabsTrigger>
        </TabsList>
        <TabsContent value="personal-info" className="flex flex-col gap-8">
          <EditProfileForm />
        </TabsContent>
        <TabsContent value="change-passsword" className="flex flex-col gap-8">
          <ChangePasswordForm />
        </TabsContent>
        <TabsContent value="system-settings" className="flex flex-col gap-8">
          <SystemSettingsForm monthlyFee={monthlyFee!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
