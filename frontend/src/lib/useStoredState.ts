"use client";

import { useLayoutEffect, useState } from "react";

/**
 * Estado React sincronizado com um valor persistido (ex: localStorage).
 *
 * O valor salvo só existe no cliente, então é lido depois do mount via
 * useLayoutEffect — fazer isso durante o render (ou numa inicialização
 * "lazy" do useState) causaria mismatch de hidratação entre servidor e
 * cliente. useLayoutEffect roda antes do paint, então a troca do valor
 * padrão para o salvo fica praticamente imperceptível.
 */
export function useStoredState<T>(defaultValue: T, read: () => T, write: (value: T) => void): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    setValue(read());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function setStoredValue(next: T) {
    write(next);
    setValue(next);
  }

  return [value, setStoredValue];
}
