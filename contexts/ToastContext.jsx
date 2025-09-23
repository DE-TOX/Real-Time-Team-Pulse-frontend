'use client'
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  ToastProvider,
  ToastViewport,
  ToastWithIcon
} from '@/components/ui/toast';

const ToastContext = createContext();

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 3000;

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(toast =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast
        )
      };
    case 'DISMISS_TOAST':
      const { toastId } = action;
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map(toast =>
            toast.id === toastId || toastId === undefined
              ? { ...toast, open: false }
              : toast
          )
        };
      }
      return {
        ...state,
        toasts: state.toasts.map(toast => ({ ...toast, open: false }))
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.toastId)
      };
    default:
      return state;
  }
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export function ToastContextProvider({ children }) {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: []
  });

  const addToast = useCallback((toastProps) => {
    const id = genId();
    const toast = {
      ...toastProps,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss(id);
      }
    };

    dispatch({
      type: 'ADD_TOAST',
      toast
    });

    // Auto dismiss after delay
    setTimeout(() => dismiss(id), TOAST_REMOVE_DELAY);

    return {
      id,
      dismiss: () => dismiss(id),
      update: (props) => updateToast(id, props)
    };
  }, []);

  const updateToast = useCallback((toastId, toastProps) => {
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...toastProps, id: toastId }
    });
  }, []);

  const dismiss = useCallback((toastId) => {
    dispatch({
      type: 'DISMISS_TOAST',
      toastId
    });

    setTimeout(() => {
      dispatch({
        type: 'REMOVE_TOAST',
        toastId
      });
    }, 100);
  }, []);

  const dismissAll = useCallback(() => {
    dispatch({
      type: 'DISMISS_TOAST'
    });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        addToast,
        updateToast,
        dismiss,
        dismissAll
      }}
    >
      <ToastProvider>
        {children}
        {state.toasts.map(({ id, ...toastProps }) => (
          <ToastWithIcon key={id} {...toastProps} />
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastContextProvider');
  }

  const { addToast } = context;

  return {
    ...context,
    toast: addToast,
    success: (props) => addToast({ variant: 'success', ...props }),
    error: (props) => addToast({ variant: 'error', ...props }),
    warning: (props) => addToast({ variant: 'warning', ...props }),
    info: (props) => addToast({ variant: 'info', ...props }),
    default: (props) => addToast({ variant: 'default', ...props })
  };
};