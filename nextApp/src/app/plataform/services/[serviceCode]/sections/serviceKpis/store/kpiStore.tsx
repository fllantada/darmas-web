import moment from "moment";
import { create } from "zustand";

interface IStore {
  dateRangeSelected: { start: Date; end: Date };
}

interface IActions {
  selectNewDates: (newDates: { start: Date; end: Date }) => void;
}

export const useKpiStore = create<IStore & IActions>((set, get) => ({
  dateRangeSelected: {
    start: moment(new Date()).startOf("month").toDate(),
    end: moment(new Date()).endOf("month").toDate(),
  },

  selectNewDates: newDates => {
    const { dateRangeSelected } = get();
    const newStart = moment(newDates.start);
    const newEnd = moment(newDates.end);
    const oldStart = moment(dateRangeSelected.start);
    const oldEnd = moment(dateRangeSelected.end);

    if (
      newStart.diff(oldStart, "days") === 0 &&
      newEnd.diff(oldEnd, "days") === 0
    )
      return;
    set(state => ({ ...state, dateRangeSelected: newDates }));
  },
}));
