import { create } from "zustand";

import { setUserAccess } from "./actions";

export enum Role {
  Admin = "admin",
  User = "user",
  SuperAdmin = "superAdmin",
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  deactivated: boolean;
};

interface TStore {
  users: User[];
}

interface TActions {
  initializeStore(users: User[]): void;
  setDeactivated(id: string, deactivated: boolean): Promise<void>;
  setRole(id: string, role: Role): Promise<void>;
}

const initialState = {
  users: [],
};

export const useUserStore = create<TStore & TActions>((set, get) => ({
  ...initialState,
  initializeStore: users => {
    set({ users });
  },
  setDeactivated: async (id, deactivated) => {
    const user = get().users.find(user => user.id === id);
    if (user) {
      await setUserAccess(id, deactivated, user.role);
      set({
        users: get().users.map(u => {
          if (u.id === id) {
            return {
              ...u,
              deactivated,
            };
          }
          return u;
        }),
      });
    }
  },
  setRole: async (id, role) => {
    const user = get().users.find(user => user.id === id);
    if (user) {
      await setUserAccess(id, user.deactivated, role);
      set({
        users: get().users.map(u => {
          if (u.id === id) {
            return {
              ...u,
              role,
            };
          }
          return u;
        }),
      });
    }
  },
}));
