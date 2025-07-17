import { message, notification, App } from 'antd';

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Error Types
interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

// Toast Service using App component context
export const useToastService = () => {
  const { message: appMessage } = App.useApp();
  
  return {
    // Success toast
    success: (content: string): void => {
      try {
        appMessage.success(content);
      } catch (error) {
        alert(`SUCCESS: ${content}`);
      }
    },

    // Error toast
    error: (content: string): void => {
      try {
        appMessage.error(content);
      } catch (error) {
        alert(`ERROR: ${content}`);
      }
    },

    // Warning toast
    warning: (content: string): void => {
      try {
        appMessage.warning(content);
      } catch (error) {
        alert(`WARNING: ${content}`);
      }
    },

    // Info toast
    info: (content: string): void => {
      try {
        appMessage.info(content);
      } catch (error) {
        alert(`INFO: ${content}`);
      }
    },

    // Loading toast
    loading: (content: string): void => {
      try {
        appMessage.loading(content);
      } catch (error) {
        alert(`LOADING: ${content}`);
      }
    },

    // Destroy all toasts
    destroy: (): void => {
      try {
        appMessage.destroy();
      } catch (error) {
        // Ignore destroy errors
      }
    },


  };
};

  // Legacy toast service for backward compatibility (will show alerts if App context is not available)
  export const toastService = {
    // Success toast
    success: (content: string): void => {
      try {
        message.success(content);
      } catch (error) {
        alert(`SUCCESS: ${content}`);
      }
    },

    // Error toast
    error: (content: string): void => {
      try {
        message.error(content);
      } catch (error) {
        alert(`ERROR: ${content}`);
      }
    },

    // Warning toast
    warning: (content: string): void => {
      try {
        message.warning(content);
      } catch (error) {
        alert(`WARNING: ${content}`);
      }
    },

    // Info toast
    info: (content: string): void => {
      try {
        message.info(content);
      } catch (error) {
        alert(`INFO: ${content}`);
      }
    },

    // Loading toast
    loading: (content: string): void => {
      try {
        message.loading(content);
      } catch (error) {
        alert(`LOADING: ${content}`);
      }
    },

    // Destroy all toasts
    destroy: (): void => {
      try {
        message.destroy();
      } catch (error) {
        // Ignore destroy errors
      }
    },


  };

// Notification Service
export const notificationService = {
  // Success notification
  success: (title: string, description?: string): void => {
    notification.success({
      message: title,
      description,
      placement: 'topRight',
    });
  },

  // Error notification
  error: (title: string, description?: string): void => {
    notification.error({
      message: title,
      description,
      placement: 'topRight',
    });
  },

  // Warning notification
  warning: (title: string, description?: string): void => {
    notification.warning({
      message: title,
      description,
      placement: 'topRight',
    });
  },

  // Info notification
  info: (title: string, description?: string): void => {
    notification.info({
      message: title,
      description,
      placement: 'topRight',
    });
  },

  // Destroy all notifications
  destroy: (): void => {
    notification.destroy();
  },
};

// Success Handler
export const useSuccessHandler = () => {
  const { message: appMessage } = App.useApp();
  
  return {
    // Handle successful operations
    handle: (message: string, type: ToastType = 'success'): void => {
      switch (type) {
        case 'success':
          appMessage.success(message);
          break;
        case 'info':
          appMessage.info(message);
          break;
        case 'warning':
          appMessage.warning(message);
          break;
        default:
          appMessage.success(message);
      }
    },

    // Handle CRUD operations
    created: (resource: string): void => {
      appMessage.success(`${resource} created successfully!`);
    },

    updated: (resource: string): void => {
      appMessage.success(`${resource} updated successfully!`);
    },

    deleted: (resource: string): void => {
      appMessage.success(`${resource} deleted successfully!`);
    },

    saved: (resource: string): void => {
      appMessage.success(`${resource} saved successfully!`);
    },
  };
};

// API Error Handler
export const useApiErrorHandler = () => {
  const { message: appMessage } = App.useApp();
  
  return {
    // Handle API errors with appropriate toast messages
    handle: (error: unknown, customMessage?: string): void => {
      let message = customMessage || 'An error occurred';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as ApiErrorResponse;
        const response = apiError.response;
        if (response?.data?.error) {
          message = response.data.error;
        } else if (response?.status) {
          if (response.status === 401) {
            message = 'Authentication failed. Please login again.';
          } else if (response.status === 403) {
            message = 'You do not have permission to perform this action.';
          } else if (response.status === 404) {
            message = 'Resource not found.';
          } else if (response.status >= 500) {
            message = 'Server error. Please try again later.';
          }
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const errorWithMessage = error as { message: string };
        message = errorWithMessage.message;
      }

      appMessage.error(message);
    },

    // Handle network errors
    handleNetworkError: (): void => {
      appMessage.error('Network error. Please check your connection.');
    },

    // Handle validation errors
    handleValidationError: (errors: Record<string, string[]>): void => {
      const errorMessages = Object.values(errors).flat();
      errorMessages.forEach(error => {
        appMessage.error(error);
      });
    },
  };
};

// Legacy handlers for backward compatibility
export const successHandler = {
  // Handle successful operations
  handle: (message: string, type: ToastType = 'success'): void => {
    switch (type) {
      case 'success':
        toastService.success(message);
        break;
      case 'info':
        toastService.info(message);
        break;
      case 'warning':
        toastService.warning(message);
        break;
      default:
        toastService.success(message);
    }
  },

  // Handle CRUD operations
  created: (resource: string): void => {
    toastService.success(`${resource} created successfully!`);
  },

  updated: (resource: string): void => {
    toastService.success(`${resource} updated successfully!`);
  },

  deleted: (resource: string): void => {
    toastService.success(`${resource} deleted successfully!`);
  },

  saved: (resource: string): void => {
    toastService.success(`${resource} saved successfully!`);
  },
};

export const apiErrorHandler = {
  // Handle API errors with appropriate toast messages
  handle: (error: unknown, customMessage?: string): void => {
    let message = customMessage || 'An error occurred';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as ApiErrorResponse;
      const response = apiError.response;
      if (response?.data?.error) {
        message = response.data.error;
      } else if (response?.status) {
        if (response.status === 401) {
          message = 'Authentication failed. Please login again.';
        } else if (response.status === 403) {
          message = 'You do not have permission to perform this action.';
        } else if (response.status === 404) {
          message = 'Resource not found.';
        } else if (response.status >= 500) {
          message = 'Server error. Please try again later.';
        }
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      const errorWithMessage = error as { message: string };
      message = errorWithMessage.message;
    }

    toastService.error(message);
  },

  // Handle network errors
  handleNetworkError: (): void => {
    toastService.error('Network error. Please check your connection.');
  },

  // Handle validation errors
  handleValidationError: (errors: Record<string, string[]>): void => {
    const errorMessages = Object.values(errors).flat();
    errorMessages.forEach(error => {
      toastService.error(error);
    });
  },
};

export default toastService;
