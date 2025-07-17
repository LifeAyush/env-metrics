import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';

// Generic URL state hook
export function useUrlState<T extends Record<string, unknown>>(
  initialState: T,
  options?: {
    serialize?: (value: T) => Record<string, unknown>;
    deserialize?: (params: Record<string, unknown>) => T;
    replace?: boolean;
  }
) {
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [
    options?.serialize,
    options?.deserialize,
    options?.replace
  ]);
  
  // Parse initial state from URL or use default
  const getInitialState = useCallback((): T => {
    const urlParams = queryString.parse(location.search);
    if (memoizedOptions?.deserialize) {
      return memoizedOptions.deserialize(urlParams);
    }
    
    // Default deserialization
    const state: Partial<T> = {};
    Object.keys(initialState).forEach(key => {
      const urlValue = urlParams[key];
      if (urlValue !== undefined) {
        if (Array.isArray(initialState[key])) {
          state[key as keyof T] = (Array.isArray(urlValue) ? urlValue : [urlValue]) as T[keyof T];
        } else if (typeof initialState[key] === 'number') {
          state[key as keyof T] = Number(urlValue) as T[keyof T];
        } else if (typeof initialState[key] === 'boolean') {
          state[key as keyof T] = (urlValue === 'true') as T[keyof T];
        } else {
          state[key as keyof T] = urlValue as T[keyof T];
        }
      } else {
        state[key as keyof T] = initialState[key] as T[keyof T];
      }
    });
    
    return state as T;
  }, [initialState, location.search, memoizedOptions?.deserialize]);

  const [state, setState] = useState<T>(getInitialState);

  // Update URL when state changes
  const updateUrl = useCallback((newState: T) => {
    const serialized = memoizedOptions?.serialize ? memoizedOptions.serialize(newState) : newState;
    const params = queryString.stringify(serialized, { 
      skipNull: true, 
      skipEmptyString: true,
      arrayFormat: 'comma'
    });
    
    if (memoizedOptions?.replace) {
      setSearchParams(params, { replace: true });
    } else {
      setSearchParams(params);
    }
  }, [setSearchParams, memoizedOptions]);

  // Update state and URL
  const setUrlState = useCallback((newState: T | ((prev: T) => T)) => {
    const updatedState = typeof newState === 'function' ? newState(state) : newState;
    setState(updatedState);
    updateUrl(updatedState);
  }, [state, updateUrl]);

  // Update state when URL changes (but not when we're the one updating it)
  useEffect(() => {
    const newState = getInitialState();
    // Only update if the state is actually different to prevent loops
    if (JSON.stringify(newState) !== JSON.stringify(state)) {
      setState(newState);
    }
  }, [location.search, getInitialState, state]);

  return [state, setUrlState] as const;
}

// Specific hook for metrics filters
export interface MetricsUrlState {
  [key: string]: unknown;
  page: number;
  limit: number; // Changed from page_size to match backend
  sort_by?: string;
  order?: 'asc' | 'desc'; // Changed from sort_order to match backend
  category?: string; // Changed from string to match backend
  search?: string;
}

export function useMetricsUrlState() {
  const initialState: MetricsUrlState = {
    page: 1,
    limit: 50, // API will fetch 50 results
  };

  const serialize = (state: MetricsUrlState): Record<string, unknown> => ({
    page: state.page,
    limit: state.limit,
    sort_by: state.sort_by,
    order: state.order,
    category: state.category,
    search: state.search,
  });

  const deserialize = (params: Record<string, unknown>): MetricsUrlState => ({
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 50, // API will fetch 50 results
    sort_by: params.sort_by as string | undefined,
    order: params.order === 'asc' || params.order === 'desc' ? params.order as 'asc' | 'desc' : undefined,
    category: params.category as string | undefined,
    search: params.search as string | undefined,
  });

  return useUrlState(initialState, {
    serialize,
    deserialize,
    replace: true,
  });
}

export default useUrlState; 