import { createContext, useContext, useReducer } from "react";

export function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

export function useDialogDispatch() {
  const ctx = useContext(DialogDispatch);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

/////////////////////////////////////////////////

const initialState = {
  signin: false,
  editprofile: false,
  confirm: false,
  warning: false,
};

const DialogContext = createContext<undefined | Dialogs>(undefined);
const DialogDispatch = createContext<undefined | React.Dispatch<Action>>(
  undefined
);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [value, dispatch] = useReducer(reducer, initialState);

  //dispatch({name: "confirm",type: "hide"})

  return (
    <DialogContext.Provider value={value}>
      <DialogDispatch.Provider value={dispatch}>
        {children}
      </DialogDispatch.Provider>
    </DialogContext.Provider>
  );
}

type Type = "show" | "hide" | "toggle";
type Name = keyof typeof initialState;

type Dialogs = typeof initialState;
type Action = { type: Type; name: Name };

function reducer(dialogs: Dialogs, action: Action) {
  switch (action.type) {
    case "show": {
      return { ...initialState, [action.name]: true };
    }
    case "hide": {
      return { ...initialState, [action.name]: false };
    }
    case "toggle": {
      return { ...initialState, [action.name]: !dialogs[action.name] };
    }
    default: {
      return dialogs;
    }
  }
}
