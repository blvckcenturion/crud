import { MutationFunction, QueryKey, useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { useToast } from "@/components/ui/use-toast";

type Action = 'create' | 'update' | 'delete';

interface ActionMessages {
  [key: string]: {
    success: string;
    error: string;
  };
}

interface UseSuccessErrorMutationOptions<TData, TError, TVariables, TContext> extends UseMutationOptions<TData, TError, TVariables, TContext> {
  queryKey: QueryKey | QueryKey[];
  closeDialog?: () => void;
}

const useSuccessErrorMutation = <TData, TError, TVariables, TContext>(
  mutationFn: MutationFunction<TData, TVariables>,
  collectionName: string,
  action: Action,
  options: UseSuccessErrorMutationOptions<TData, TError, TVariables, TContext>
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const actionMessages: ActionMessages = {
    create: {
      success: `${collectionName} creado con éxito`,
      error: `Error al crear ${collectionName}`
    },
    update: {
      success: `${collectionName} actualizado con éxito`,
      error: `Error al actualizar ${collectionName}`
    },
    delete: {
      success: `${collectionName} eliminado con éxito`,
      error: `Error al eliminar ${collectionName}`
    }
  };

  // Extract the original onSuccess and onError functions
  const { onSuccess, onError } = options;

  return useMutation<TData, TError, TVariables, TContext>(mutationFn, {
    ...options,
    onSuccess: (data, variables, context) => {
      toast({
        variant: "default",
        title: actionMessages[action].success
      });
      // Invalidate multiple queries if queryKey is an array
      if (Array.isArray(options.queryKey)) {
        options.queryKey.forEach(key => queryClient.invalidateQueries(key));
      } else {
        queryClient.invalidateQueries(options.queryKey);
      }
      options.closeDialog?.();
      // Call the original onSuccess if it exists
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast({
        variant: "destructive",
        title: actionMessages[action].error,
        description: error instanceof Error ? error.message : String(error)
      });
      // Call the original onError if it exists
      onError?.(error, variables, context);
    }
  });
};

export default useSuccessErrorMutation;