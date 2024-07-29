import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export enum NotificationType {
  Email = "email",
  SMS = "sms",
  App = "app",
}

type NotificationSelectorProps = {
  value: Set<NotificationType>;
  onChange: (value: Set<NotificationType>) => void;
  disabled?: boolean;
};

export default function NotificationSelector({
  value,
  onChange,
  disabled,
}: NotificationSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="notification-email"
          value={NotificationType.Email}
          checked={value.has(NotificationType.Email)}
          onCheckedChange={checked => {
            if (checked) {
              value.add(NotificationType.Email);
            } else {
              value.delete(NotificationType.Email);
            }
            onChange(value);
          }}
          disabled={disabled}
        />
        <Label htmlFor="notification-email">Email</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="notification-sms"
          value={NotificationType.SMS}
          checked={value.has(NotificationType.SMS)}
          onCheckedChange={checked => {
            if (checked) {
              value.add(NotificationType.SMS);
            } else {
              value.delete(NotificationType.SMS);
            }
            onChange(value);
          }}
          disabled={disabled}
        />
        <Label htmlFor="notification-sms">SMS</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="notification-app"
          value={NotificationType.App}
          checked={value.has(NotificationType.App)}
          onCheckedChange={checked => {
            if (checked) {
              value.add(NotificationType.App);
            } else {
              value.delete(NotificationType.App);
            }
            onChange(value);
          }}
          disabled={disabled}
        />
        <Label htmlFor="notification-app">App</Label>
      </div>
    </div>
  );
}
