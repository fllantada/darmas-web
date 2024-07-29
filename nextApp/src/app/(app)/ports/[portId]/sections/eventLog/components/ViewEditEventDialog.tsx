import { useEffect, useMemo, useRef, useState } from "react";
import { Edit, Save, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LoadingButton,
  type ButtonStateEnum,
} from "@/components/ui/loading-button";

import { Event } from "../interfaces";
import { useEventLogStore } from "../store";
import EventForm, { type FormMethods } from "./form/eventForm/EventForm";
import ViewEvent from "./ViewEvent";

enum DialogMode {
  VIEW,
  EDIT,
  ERROR,
}

function ViewEditEventDialog() {
  const formRef = useRef<FormMethods>(null);
  const [deleteState, setDeleteState] = useState<ButtonStateEnum>("idle");
  const [updateState, setUpdateState] = useState<ButtonStateEnum>("idle");
  const [open, setOpen] = useState(false);
  const selectedEvent = useEventLogStore(state => state.selectedEvent);
  const [mode, setMode] = useState(DialogMode.VIEW);
  const { deleteEvent, updateEvent } = useEventLogStore();
  const selectedTerminal = useEventLogStore(state => state.selectedTerminal);
  const recurrence = useEventLogStore(state => state.recurrence);

  const isRecurrentEvent: boolean = useMemo(() => {
    return recurrence.recurrence;
  }, [recurrence]);

  useEffect(() => {
    if (selectedEvent) {
      setOpen(true);
    }
  }, [selectedEvent]);

  function onSaveClicked() {
    formRef.current?.submitForm();
    setMode(DialogMode.VIEW);
  }

  async function onDeleteClicked() {
    try {
      if (selectedEvent?.id) {
        setDeleteState("loading");
        await deleteEvent(selectedEvent?.id);
        setOpen(false);
        toast.success("Event deleted");
        setDeleteState("idle");
        setMode(DialogMode.VIEW);
      }
    } catch (error) {
      setDeleteState("error");
      setMode(DialogMode.VIEW);
    }
  }

  async function onFormSubmit(newEventData: Event) {
    try {
      if (selectedEvent?.id) {
        setUpdateState("loading");

        const updatedEvent: Event = {
          ...selectedEvent,
          ...newEventData,
        };
        await updateEvent(updatedEvent);

        setUpdateState("idle");
        setOpen(false);
        toast.success("Event updated");
        setMode(DialogMode.VIEW);
      }
    } catch (error) {
      setUpdateState("error");
      setMode(DialogMode.VIEW);
    }
  }

  function onEditClicked() {
    if (
      selectedTerminal !== undefined &&
      selectedEvent &&
      selectedEvent?.terminals.length > 1
    ) {
      setMode(DialogMode.ERROR);
    } else setMode(DialogMode.EDIT);
  }

  function handleCloseClick() {
    useEventLogStore.getState().unSelectEventOnCalendar();
    setOpen(false);
    setMode(DialogMode.VIEW);
  }
  function handleOpenChange(status: boolean) {
    setOpen(status);
    if (status === false) useEventLogStore.getState().unSelectEventOnCalendar();
  }

  if (!selectedEvent) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="4xl" showCloseButton={false}>
        <DialogDescription>
          {mode == DialogMode.VIEW && <ViewEvent event={selectedEvent} />}
          {mode === DialogMode.EDIT && (
            <EventForm ref={formRef} onSubmit={onFormSubmit} />
          )}
          {mode === DialogMode.ERROR && (
            <div className="my-8">
              event is asociated with multiple terminals. Please go to ports and
              edit the event from there.
            </div>
          )}
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild onClick={handleCloseClick}>
            <Button variant="ghost" className="rounded-full">
              Close
            </Button>
          </DialogClose>
          {mode === DialogMode.VIEW ? (
            <Button onClick={onEditClicked} className="rounded-full">
              <Edit size={15} className="mr-2" /> Edit
            </Button>
          ) : (
            <LoadingButton
              onClick={onSaveClicked}
              className="rounded-full"
              state={updateState}
              errorAutoResetDelay={3}
            >
              {updateState === "loading" ? (
                "Saving..."
              ) : (
                <>
                  <Save size={15} className="mr-2" /> Save
                </>
              )}
            </LoadingButton>
          )}
          {mode === DialogMode.VIEW && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="rounded-full">
                  <Trash size={15} className="mr-2" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  Are you sure you want to delete:{" "}
                  <div className="my-2">
                    <b>{selectedEvent?.title}</b>
                  </div>
                  {isRecurrentEvent
                    ? `This is a recurrent event. This action will remove this event and future recurrences for ${selectedTerminal ? selectedTerminal.terminalCode + " terminal." : "all terminals."}`
                    : `This action will remove this event for ${selectedTerminal ? selectedTerminal.terminalCode : "all terminals"}`}
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost" className="rounded-full">
                      Cancel
                    </Button>
                  </DialogClose>
                  <LoadingButton
                    state={deleteState}
                    variant="destructive"
                    onClick={onDeleteClicked}
                    className="rounded-full"
                    errorAutoResetDelay={3}
                  >
                    {deleteState === "loading" ? (
                      "Deleting..."
                    ) : (
                      <>
                        <Trash size={15} className="mr-2" /> Yes, Delete
                      </>
                    )}
                  </LoadingButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewEditEventDialog;
