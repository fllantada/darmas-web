import { useRef, useState } from "react";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LoadingButton,
  type ButtonStateEnum,
} from "@/components/ui/loading-button";

import { DefaultRecurrency, Event } from "../../../interfaces";
import { useEventLogStore } from "../../../store";
import EventForm, { type FormMethods } from "./EventForm";

export default function CreateEventDialog() {
  const [state, setState] = useState<ButtonStateEnum>("idle");
  const formRef = useRef<FormMethods>(null);
  const [open, setOpen] = useState(false);
  const { createEvent } = useEventLogStore();

  function onCreateClicked() {
    formRef.current?.submitForm();
  }

  async function onFormSubmit(data: Event) {
    try {
      setState("loading");

      const event: Event = {
        ...data,
        timezone: data.timezone || "UTC",
        description: data.description || "",
      };

      await createEvent(event);

      setOpen(false);
      setState("idle");
      toast.success("Event created");
    } catch (error) {
      setState("error");
    }
  }
  const handleOpenChange = (isOpen: boolean) => {
    useEventLogStore.getState().updateRecurrence(DefaultRecurrency);
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="mr-2 rounded-full" variant="outline">
          Create Event <Calendar size={16} className="ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent size="4xl" showCloseButton={false}>
        <EventForm ref={formRef} onSubmit={onFormSubmit} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="rounded-full">
              Close
            </Button>
          </DialogClose>
          <LoadingButton
            onClick={onCreateClicked}
            className="rounded-full"
            state={state}
            errorAutoResetDelay={3}
          >
            {state === "loading" ? "Creating..." : "Create"}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
